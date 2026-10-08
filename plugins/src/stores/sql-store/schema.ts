/** One Durable Object (or one local SQLite file) plus the migrations that run on it. */
export const DEFAULT_SQL_SCHEMA = 'work';

export function sqlStorePluginName(schema: string, prefix = 'store-sql'): string {
  return schema === DEFAULT_SQL_SCHEMA ? prefix : `${prefix}-${schema}`;
}
