import type { PluginSlots } from './plugin-slots.js';
import type { RuntimePlugin } from '@/types/plugin.js';
import { DEFAULT_SQL_SCHEMA } from '@/types/sql-store/schema.js';
import { pickSqlStore } from './pick-sql-store.js';
import { storeContext } from './store-context.js';

export function runPluginMigrations(slots: PluginSlots, plugin: RuntimePlugin): void {
  if (!plugin.sqlMigrations?.length) return;
  const sql = pickSqlStore(storeContext(slots), plugin.sqlSchema ?? DEFAULT_SQL_SCHEMA);
  if (!sql) return;
  sql.migrate(plugin.name, plugin.sqlMigrations);
}
