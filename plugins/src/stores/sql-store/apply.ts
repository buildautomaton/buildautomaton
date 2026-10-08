import type { PluginSlots } from '@buildautomaton/runtime';
import { asHost } from '../../host-slots.js';
import type { SqlStorePlugin } from './plugin.js';
import { DEFAULT_SQL_SCHEMA } from './schema.js';
import { withOpenerMigrations } from './opener-migrations.js';

export function applySqlStorePlugin(slots: PluginSlots, plugin: SqlStorePlugin): void {
  const host = asHost(slots);
  const schema = plugin.options?.schema ?? DEFAULT_SQL_SCHEMA;
  if (plugin.opener) {
    host.sqlOpeners[schema] = withOpenerMigrations(plugin.opener, plugin.name, plugin.sqlMigrations);
  }
  const sql = plugin.implementation;
  if (!sql) return;
  host.sqlStores[schema] = sql;
  if (schema === DEFAULT_SQL_SCHEMA) host.sqlStore = sql;
  if (plugin.sqlMigrations?.length) {
    slots.ready.push(Promise.resolve(sql.migrate(plugin.name, plugin.sqlMigrations)));
  }
}
