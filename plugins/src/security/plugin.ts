import type { PluginInit } from '@buildautomaton/runtime';
import type { ExtensionPlugin } from '@plugins/extension-plugin.js';
import { requireSqlStore } from '@plugins/stores/sql-store/pick.js';
import { DEFAULT_SQL_SCHEMA } from '@plugins/stores/sql-store/schema.js';
import type { StoreContext } from '@plugins/transport/http/types/contribution.js';
import { SECURITY_MIGRATIONS } from './migrations.js';
import { createSecurity } from './open.js';

export type SecurityOptions = { workspaceId?: string };

export function securityPlugin(init: PluginInit<SecurityOptions> = {}): ExtensionPlugin {
  const workspaceId = init.options?.workspaceId ?? 'local';
  return {
    name: 'security',
    description: 'Workspace users, roles, and grants. Use before a data store read or mutation.',
    targetRuntime: 'node',
    services: [{ id: 'security', options: { workspaceId } }],
    options: { workspaceId },
    sqlSchema: DEFAULT_SQL_SCHEMA,
    sqlMigrations: SECURITY_MIGRATIONS,
    createFromStores: (stores: StoreContext) =>
      createSecurity(requireSqlStore(stores, DEFAULT_SQL_SCHEMA, 'security plugin'), workspaceId),
    runtime: init.runtime,
  };
}
