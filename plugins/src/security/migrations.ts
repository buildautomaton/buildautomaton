import type { SqlMigration } from '@plugins/stores/sql-store/migration.js';
import { SECURITY_SCHEMA } from './schema.js';

export const SECURITY_MIGRATIONS: SqlMigration[] = [
  {
    name: '001_security',
    migrate: (sql) => {
      sql.exec(SECURITY_SCHEMA);
    },
  },
];
