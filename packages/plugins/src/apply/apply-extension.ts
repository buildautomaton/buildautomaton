import type { PluginSlots } from '@buildautomaton/runtime';
import type { ExtensionPlugin } from '../extension-plugin.js';
import { DEFAULT_SQL_SCHEMA } from '../stores/sql-store/schema.js';
import { pickSqlStore } from '../stores/sql-store/pick.js';
import { storeContext } from './store-context.js';

/** Feature plugins: optional store factory, then extras and SQL migrations. */
export function applyExtensionPlugin(slots: PluginSlots, plugin: ExtensionPlugin): void {
  const impl = plugin.implementation ?? plugin.createFromStores?.(storeContext(slots));
  if (impl && typeof impl === 'object') {
    slots.extras[plugin.name] = impl;
    if (plugin.kind) slots.extras[plugin.kind] = impl;
  }
  queueMigrations(slots, plugin);
}

function queueMigrations(slots: PluginSlots, plugin: ExtensionPlugin): void {
  if (!plugin.sqlMigrations?.length) return;
  const sql = pickSqlStore(storeContext(slots), plugin.sqlSchema ?? DEFAULT_SQL_SCHEMA);
  if (!sql?.migrate) return;
  slots.ready.push(Promise.resolve(sql.migrate(plugin.name, plugin.sqlMigrations)).then(() => undefined));
}
