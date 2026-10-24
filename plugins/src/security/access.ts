import { sqlAll, sqlGet, sqlRun } from '@plugins/stores/sql-store/await.js';
import type { AnySqlStore } from '@plugins/stores/sql-store/any-store.js';
import type { Grant, Scope } from './allow.js';

export type Access = { userId: string; owner: boolean; grants: Grant[] };

export async function ensureOwner(sql: AnySqlStore, workspaceId: string): Promise<void> {
  const existing = await sqlGet(sql, 'SELECT id FROM sec_user WHERE workspace_id = ? AND id = ?', [
    workspaceId,
    'owner',
  ]);
  if (existing) return;
  await sqlRun(sql, 'INSERT INTO sec_user (workspace_id, id, name) VALUES (?, ?, ?)', [
    workspaceId,
    'owner',
    'Owner',
  ]);
  await sqlRun(sql, 'INSERT INTO sec_role (workspace_id, id, name) VALUES (?, ?, ?)', [
    workspaceId,
    'owner',
    'owner',
  ]);
  await sqlRun(sql, 'INSERT INTO sec_member (workspace_id, user_id, role_id) VALUES (?, ?, ?)', [
    workspaceId,
    'owner',
    'owner',
  ]);
  await sqlRun(sql, 'INSERT INTO sec_actor (workspace_id, user_id) VALUES (?, ?)', [workspaceId, 'owner']);
}

export async function loadAccess(sql: AnySqlStore, workspaceId: string): Promise<Access> {
  await ensureOwner(sql, workspaceId);
  const actor = await sqlGet(sql, 'SELECT user_id FROM sec_actor WHERE workspace_id = ?', [workspaceId]);
  const userId = String(actor?.user_id ?? 'owner');
  const roles = await sqlAll(
    sql,
    `SELECT r.id, r.name FROM sec_member m
     JOIN sec_role r ON r.workspace_id = m.workspace_id AND r.id = m.role_id
     WHERE m.workspace_id = ? AND m.user_id = ?`,
    [workspaceId, userId],
  );
  if (roles.some((role) => role.name === 'owner')) return { userId, owner: true, grants: [] };
  const grants: Grant[] = [];
  for (const role of roles) grants.push(...(await grantsFor(sql, workspaceId, String(role.id))));
  return { userId, owner: false, grants };
}

async function grantsFor(sql: AnySqlStore, workspaceId: string, roleId: string): Promise<Grant[]> {
  const rows = await sqlAll(
    sql,
    'SELECT collection, can_read, actions, scope FROM sec_grant WHERE workspace_id = ? AND role_id = ?',
    [workspaceId, roleId],
  );
  return rows.map((row) => ({
    collection: String(row.collection),
    read: row.can_read === 1,
    actions: parseJson<string[]>(row.actions, []),
    scope: parseJson<Scope>(row.scope, { kind: 'all' }),
  }));
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
