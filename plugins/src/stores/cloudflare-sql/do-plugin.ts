import type { SqlStorePlugin, SqlStorePluginInit } from '@plugins/stores/sql-store/plugin.js';
import type { SqlStoreOptions } from '@plugins/stores/sql-store/options.js';
import { DEFAULT_SQL_SCHEMA, sqlStorePluginName } from '@plugins/stores/sql-store/schema.js';
import type { DoSqlBackend } from './do-storage.js';
import { createDoSqlStore } from './do-store.js';

export type DoSqlStoreOptions = SqlStoreOptions & {
  storage?: DoSqlBackend;
};

export type DoSqlStorePluginInit = Omit<SqlStorePluginInit, 'options'> & {
  options?: DoSqlStoreOptions;
};

/** SQL store backed by one Durable Object (`ctx.storage.sql`) per schema. */
export function doSqlStorePlugin(init: DoSqlStorePluginInit = {}): SqlStorePlugin {
  const storage = init.options?.storage;
  if (!storage && !init.implementation) {
    throw new Error('doSqlStorePlugin requires options.storage or implementation');
  }
  const schema = init.options?.schema ?? DEFAULT_SQL_SCHEMA;
  const base = storage ? createDoSqlStore(storage) : undefined;
  const options = { id: init.options?.id ?? schema, schema, backend: 'do' as const };
  const implementation = { ...base, ...init.implementation } as SqlStorePlugin['implementation'];
  return {
    name: sqlStorePluginName(schema, 'store-sql-do'),
    description: 'Durable Object SQL store. Use on Workers when one schema should own its own SQL storage.',
    targetRuntime: 'node',
    services: [{ id: 'sql-store', options, implementation }],
    options,
    sqlMigrations: init.sqlMigrations,
    implementation,
    runtime: init.runtime,
  };
}
