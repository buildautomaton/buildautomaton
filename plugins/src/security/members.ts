import { sqlRun } from '@plugins/stores/sql-store/await.js';
import type { AnySqlStore } from '@plugins/stores/sql-store/any-store.js';
import type { Grant } from './allow.js';
import { ensureOwner } from './access.js';

export async function setActor(sql: AnySqlStore, workspaceId: string, userId: string): Promise<void> {
  await ensureOwner(sql, workspaceId);
  await sqlRun(
    sql,
    `INSERT INTO sec_actor (workspace_id, user_id) VALUES (?, ?)
     ON CONFLICT(workspace_id) DO UPDATE SET user_id = excluded.user_id`,
    [workspaceId, userId],
  );
}

export async function addRole(
  sql: AnySqlStore,
  workspaceId: string,
  role: { id: string; name: string; grants: Grant[] },
): Promise<void> {
  await ensureOwner(sql, workspaceId);
  await sqlRun(
    sql,
    `INSERT INTO sec_role (workspace_id, id, name) VALUES (?, ?, ?)
     ON CONFLICT(workspace_id, id) DO UPDATE SET name = excluded.name`,
    [workspaceId, role.id, role.name],
  );
  await sqlRun(sql, 'DELETE FROM sec_grant WHERE workspace_id = ? AND role_id = ?', [workspaceId, role.id]);
  for (const grant of role.grants) {
    await sqlRun(
      sql,
      `INSERT INTO sec_grant (workspace_id, role_id, collection, can_read, actions, scope)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        workspaceId,
        role.id,
        grant.collection,
        grant.read ? 1 : 0,
        JSON.stringify(grant.actions),
        JSON.stringify(grant.scope),
      ],
    );
  }
}

export async function invite(
  sql: AnySqlStore,
  workspaceId: string,
  user: { id: string; name: string; roleId: string },
): Promise<void> {
  await ensureOwner(sql, workspaceId);
  await sqlRun(
    sql,
    `INSERT INTO sec_user (workspace_id, id, name) VALUES (?, ?, ?)
     ON CONFLICT(workspace_id, id) DO UPDATE SET name = excluded.name`,
    [workspaceId, user.id, user.name],
  );
  await sqlRun(sql, 'INSERT OR IGNORE INTO sec_member (workspace_id, user_id, role_id) VALUES (?, ?, ?)', [
    workspaceId,
    user.id,
    user.roleId,
  ]);
}
