import type { SqlStorePlugin, SqlStorePluginInit } from '@/types/sql-store/plugin.js';
import { DEFAULT_SQL_SCHEMA, sqlStorePluginName } from '@/types/sql-store/schema.js';
import { openSqliteDatabase } from './open.js';
import { createSqlStore } from './store.js';
export { defaultSqlFile } from './default-file.js';
import { defaultSqlFile } from './default-file.js';

export function sqlStorePlugin(init: SqlStorePluginInit = {}): SqlStorePlugin {
  const cwd = init.runtime?.cwd ?? process.cwd();
  const schema = init.options?.schema ?? DEFAULT_SQL_SCHEMA;
  const file = init.options?.file ?? defaultSqlFile(cwd, schema);
  return {
    name: sqlStorePluginName(schema),
    kind: 'sql-store',
    options: { file, id: init.options?.id ?? schema, schema },
    sqlMigrations: init.sqlMigrations,
    implementation: { ...createSqlStore(openSqliteDatabase(file)), ...init.implementation },
    runtime: init.runtime,
  };
}
