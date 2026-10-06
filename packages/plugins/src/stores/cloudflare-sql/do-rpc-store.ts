import type { AnySqlStore } from '@plugins/stores/sql-store/any-store.js';
import type { SqlBind } from '@plugins/stores/sql-store/interface.js';
import type { DoSqlRpcStub } from './do-rpc.js';
import { runAnySqlMigrations } from '../sql-store/migrate-any.js';

export function createDoRpcSqlStore(stub: DoSqlRpcStub): AnySqlStore {
  const store: AnySqlStore = {
    backend: 'do',
    exec(sql) {
      return stub.sqlExec(sql);
    },
    run(sql, params: SqlBind[] = []) {
      return stub.sqlRun(sql, params);
    },
    get(sql, params: SqlBind[] = []) {
      return stub.sqlGet(sql, params);
    },
    all(sql, params: SqlBind[] = []) {
      return stub.sqlAll(sql, params);
    },
    async transaction(fn) {
      return await fn();
    },
    async migrate(scope, migrations) {
      await runAnySqlMigrations(store, scope, migrations);
    },
  };
  return store;
}
