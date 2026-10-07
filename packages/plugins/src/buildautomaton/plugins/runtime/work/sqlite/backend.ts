import { sqlStorePlugin, type SqlStore } from '@plugins/buildautomaton/host.js';
import type { ArtifactKind } from '@plugins/buildautomaton/types/artifact/kind.js';
import type { WorkImplementation } from '@plugins/buildautomaton/types/work/implementation.js';
import { createWorkHub } from './hub.js';
import { sqliteMethods } from './methods.js';
import { WORK_MIGRATIONS } from './migrations.js';
import { builtinArtifactKinds } from '../../artifacts/builtins.js';

export function memorySqlStore(): SqlStore {
  const sql = sqlStorePlugin({ options: { file: ':memory:' } }).implementation;
  if (!sql) throw new Error('sql-store plugin missing implementation');
  return sql as SqlStore;
}

export function createSqliteWorkBackend(
  sql: SqlStore = memorySqlStore(),
  artifacts: ArtifactKind[] = builtinArtifactKinds(),
): WorkImplementation {
  sql.migrate('work-sqlite', WORK_MIGRATIONS);
  const hub = createWorkHub();
  const withDb = async <T>(fn: (db: SqlStore) => T | Promise<T>): Promise<T> => fn(sql);
  return sqliteMethods(withDb, hub, artifacts);
}
