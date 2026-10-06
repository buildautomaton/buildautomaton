import type { SqlBind, SqlStore } from '@plugins/stores/sql-store/interface.js';
import { runSqliteMigrations } from '../sql-store/migrate.js';
import type { DoSqlBackend } from './do-storage.js';

export function createDoSqlStore(backend: DoSqlBackend): SqlStore {
  const store: SqlStore = {
    backend: 'do',
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
