import {
  sqlStorePlugin,
  sqlStorePluginName,
  type AnySqlStore,
  type PluginInit,
  type SqlStorePlugin,
} from '@buildautomaton/plugins';
import { MARKETPLACE_PLUGIN_SQL_SCHEMA } from './plugins/runtime/plugin.js';
import { PLUGIN_MIGRATIONS } from './plugins/runtime/plugin-migrations.js';

/** One local SQLite file per marketplace plugin id. */
export function sqliteOpenerPlugin(init: PluginInit = {}): SqlStorePlugin {
  const cwd = init.runtime?.cwd ?? process.cwd();
  const schema = MARKETPLACE_PLUGIN_SQL_SCHEMA;
  const cache = new Map<string, AnySqlStore>();
  const options = { schema, backend: 'sqlite' as const, id: schema };
  return {
    name: sqlStorePluginName(schema, 'store-sql-opener'),
    services: [{ id: 'sql-store', options }],
    options,
    sqlMigrations: PLUGIN_MIGRATIONS,
    opener: {
      backend: 'sqlite',
      open(key) {
        let sql = cache.get(key);
        if (!sql) {
          sql = sqlStorePlugin({
            options: { schema: `${schema}-${key}`, backend: 'sqlite' },
            runtime: { cwd, log: init.runtime?.log ?? (() => {}) },
          }).implementation!;
          cache.set(key, sql);
        }
        return sql;
      },
    },
    runtime: init.runtime,
  };
}
