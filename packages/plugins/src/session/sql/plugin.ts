import type { PluginInit } from '@buildautomaton/runtime';
import type { SessionHooks } from '@plugins/session/session/hooks.js';
import type { SessionImplementation } from '@plugins/session/session/implementation.js';
import type { SessionPlugin } from '@plugins/session/session/plugin.js';
import type { SqlSessionOptions } from '@plugins/session/session/options.js';
import { DEFAULT_SQL_SCHEMA } from '@plugins/stores/sql-store/schema.js';
import { requireSqlStore } from '@plugins/stores/sql-store/pick.js';
import type { StoreContext } from '@plugins/transport/http/types/contribution.js';
import { createSqlSessionBackend } from './backend.js';
import { SESSION_MIGRATIONS } from './migrations.js';

export function sqlSessionPlugin(
  init: PluginInit<SqlSessionOptions, SessionHooks, Partial<SessionImplementation>> = {},
): SessionPlugin {
  const schema = init.options?.schema ?? DEFAULT_SQL_SCHEMA;
  return {
    name: 'session-sql',
    kind: 'session',
    options: { id: init.options?.id ?? 'sql', schema },
    hooks: init.hooks,
    supports: { stores: ['sql-store'], transports: ['http'] },
    sqlSchema: schema,
    sqlMigrations: SESSION_MIGRATIONS,
    createFromStores: (stores: StoreContext) => ({
      ...createSqlSessionBackend(requireSqlStore(stores, schema, 'session plugin')),
      ...init.implementation,
    }),
    runtime: init.runtime,
  };
}
