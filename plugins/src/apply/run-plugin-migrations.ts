import type { PluginSlots } from '@buildautomaton/runtime';
import type { SessionPlugin } from '../session/session/plugin.js';
import { DEFAULT_SQL_SCHEMA } from '../stores/sql-store/schema.js';
import { pickSqlStore } from '../stores/sql-store/pick.js';
import { storeContext } from './store-context.js';

export function runPluginMigrations(slots: PluginSlots, plugin: SessionPlugin): void {
  if (!plugin.sqlMigrations?.length) return;
  const sql = pickSqlStore(storeContext(slots), plugin.sqlSchema ?? DEFAULT_SQL_SCHEMA);
  if (!sql) return;
  slots.ready.push(Promise.resolve(sql.migrate(plugin.name, plugin.sqlMigrations)));
}
