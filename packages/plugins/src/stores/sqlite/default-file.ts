import { join } from 'node:path';
import { DEFAULT_SQL_SCHEMA } from '@plugins/stores/sql-store/schema.js';
export function defaultSqlFile(cwd: string, schema = DEFAULT_SQL_SCHEMA): string {
  if (schema === DEFAULT_SQL_SCHEMA) return join(cwd, '.harness', 'work.sqlite');
  return join(cwd, '.harness', 'sql', `${schema}.sqlite`);
}
