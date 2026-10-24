import type { AnySqlStore } from '@plugins/stores/sql-store/any-store.js';
import { judge, visibleRows, type AllowInput, type AllowResult, type Grant } from './allow.js';
import { loadAccess } from './access.js';
import { addRole, invite, setActor } from './members.js';

export type Security = {
  currentActor(): Promise<string>;
  setActor(userId: string): Promise<void>;
  allow(input: AllowInput): Promise<AllowResult>;
  filter(collection: string, rows: Record<string, unknown>[]): Promise<Record<string, unknown>[]>;
  can(action: string, collection: string): Promise<boolean>;
  addRole(role: { id: string; name: string; grants: Grant[] }): Promise<void>;
  invite(user: { id: string; name: string; roleId: string }): Promise<void>;
};

export function createSecurity(sql: AnySqlStore, workspaceId = 'local'): Security {
  return {
    currentActor: async () => (await loadAccess(sql, workspaceId)).userId,
    setActor: (userId) => setActor(sql, workspaceId, userId),
    allow: async (input) => {
      const access = await loadAccess(sql, workspaceId);
      return judge({ ...access, action: input.action, collections: input.collections, rows: input.rows ?? [] });
    },
    filter: async (collection, rows) => {
      const access = await loadAccess(sql, workspaceId);
      return visibleRows(access.grants, access.owner, access.userId, collection, rows);
    },
    can: async (action, collection) => {
      const access = await loadAccess(sql, workspaceId);
      return judge({ ...access, action, collections: [collection], rows: [] }).ok;
    },
    addRole: (role) => addRole(sql, workspaceId, role),
    invite: (user) => invite(sql, workspaceId, user),
  };
}
