import type { SqlMigration, SqlStore } from '@plugins/work/host.js';
import { WORK_SCHEMA } from './schema.js';
import { migrateWork } from './migrate.js';
import { migrateProject, projectColumnsPresent } from './migrate-project.js';
import { all } from './sql.js';

const WORK_COLUMN_NAMES = ['paused', 'prompt', 'agent_context', 'source_key'];

function asSql(sql: Parameters<SqlMigration['migrate']>[0]): SqlStore {
  return sql as SqlStore;
}

function workColumnsPresent(sql: SqlStore): boolean {
  const existing = new Set(all(sql, 'PRAGMA table_info(work)').map((row) => String(row.name ?? '')));
  return WORK_COLUMN_NAMES.every((name) => existing.has(name));
}

export const WORK_MIGRATIONS: SqlMigration[] = [
  {
    name: '001_work_checkpoint_v1',
    checkpoint: true,
    migrate: (sql) => {
      asSql(sql).exec(WORK_SCHEMA);
    },
  },
  {
    name: '002_work_columns',
    migrate: (sql) => migrateWork(asSql(sql)),
    alreadyApplied: (sql) => workColumnsPresent(asSql(sql)),
  },
  {
    name: '003_project',
    migrate: (sql) => migrateProject(asSql(sql)),
    alreadyApplied: (sql) => projectColumnsPresent(asSql(sql)),
  },
];
