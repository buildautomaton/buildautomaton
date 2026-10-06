import type { SqlStorePlugin, SqlStorePluginInit } from '@/types/sql-store/plugin.js';
import type { SqlStoreOptions } from '@/types/sql-store/options.js';
import { DEFAULT_SQL_SCHEMA, sqlStorePluginName } from '@/types/sql-store/schema.js';
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
  return {
    name: sqlStorePluginName(schema, 'store-sql-do'),
    kind: 'sql-store',
    options: { id: init.options?.id ?? schema, schema },
    sqlMigrations: init.sqlMigrations,
    implementation: { ...base, ...init.implementation } as SqlStorePlugin['implementation'],
    runtime: init.runtime,
  };
}
