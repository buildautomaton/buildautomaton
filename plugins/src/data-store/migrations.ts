import type { SqlMigration } from '@plugins/stores/sql-store/migration.js';
import { DATA_STORE_SCHEMA } from './schema.js';

export const DATA_STORE_MIGRATIONS: SqlMigration[] = [
  {
    name: '001_collections',
    migrate: (sql) => {
      sql.exec(DATA_STORE_SCHEMA);
    },
  },
];
