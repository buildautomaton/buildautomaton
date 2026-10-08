import type { SqlStorePlugin, SqlStorePluginInit } from '@plugins/stores/sql-store/plugin.js';
import { DEFAULT_SQL_SCHEMA, sqlStorePluginName } from '@plugins/stores/sql-store/schema.js';
import { openSqliteDatabase } from './open.js';
import { createSqlStore } from './store.js';
export { defaultSqlFile } from './default-file.js';
import { defaultSqlFile } from './default-file.js';

export function sqlStorePlugin(init: SqlStorePluginInit = {}): SqlStorePlugin {
  const cwd = init.runtime?.cwd ?? process.cwd();
  const schema = init.options?.schema ?? DEFAULT_SQL_SCHEMA;
  const file = init.options?.file ?? defaultSqlFile(cwd, schema);
  const options = { file, id: init.options?.id ?? schema, schema, backend: init.options?.backend ?? 'sqlite' };
  const implementation = { ...createSqlStore(openSqliteDatabase(file)), ...init.implementation };
  return {
    name: sqlStorePluginName(schema),
    description: 'SQLite SQL store on disk. Use for local persistence of work, sessions, or app data.',
    targetRuntime: 'node',
    services: [{ id: 'sql-store', options, implementation }],
    options,
    sqlMigrations: init.sqlMigrations,
    implementation,
    runtime: init.runtime,
  };
}
