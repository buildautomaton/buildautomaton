import type { PluginSlots } from './plugin-slots.js';
import type { SqlStorePlugin } from '@/types/sql-store/plugin.js';
import { DEFAULT_SQL_SCHEMA } from '@/types/sql-store/schema.js';

export function applySqlStorePlugin(slots: PluginSlots, plugin: SqlStorePlugin): void {
  const schema = plugin.options?.schema ?? DEFAULT_SQL_SCHEMA;
  const sql = plugin.implementation;
  slots.sqlStores[schema] = sql;
  if (schema === DEFAULT_SQL_SCHEMA) slots.sqlStore = sql;
  if (plugin.sqlMigrations?.length) sql.migrate(plugin.name, plugin.sqlMigrations);
}
