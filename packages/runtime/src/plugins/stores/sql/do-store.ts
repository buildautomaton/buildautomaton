import type { SqlBind, SqlStore } from '@/types/sql-store/implementation.js';
import { runSqliteMigrations } from './migrate.js';
import type { DoSqlBackend } from './do-storage.js';

export function createDoSqlStore(backend: DoSqlBackend): SqlStore {
  const store: SqlStore = {
    exec(sql) {
      backend.sql.exec(sql);
    },
    run(sql, params: SqlBind[] = []) {
      backend.sql.exec(sql, ...params);
    },
    get(sql, params: SqlBind[] = []) {
      return backend.sql.exec(sql, ...params).toArray()[0];
    },
    all(sql, params: SqlBind[] = []) {
      return backend.sql.exec(sql, ...params).toArray();
    },
    transaction(fn) {
      if (backend.transactionSync) return backend.transactionSync(fn);
      return fn();
    },
    migrate(scope, migrations) {
      runSqliteMigrations(store, scope, migrations);
    },
  };
  return store;
}
