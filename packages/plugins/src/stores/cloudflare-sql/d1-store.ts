import type { AnySqlStore } from '@plugins/stores/sql-store/any-store.js';
import type { SqlBind } from '@plugins/stores/sql-store/interface.js';
import type { D1DatabaseLike } from './d1-types.js';
import { runAnySqlMigrations } from '../sql-store/migrate-any.js';

export function createD1SqlStore(d1: D1DatabaseLike): AnySqlStore {
  const store: AnySqlStore = {
    backend: 'd1',
    async exec(sql) {
      await d1.exec(sql);
    },
    async run(sql, params: SqlBind[] = []) {
      await d1.prepare(sql).bind(...params).run();
    },
    async get(sql, params: SqlBind[] = []) {
      return (await d1.prepare(sql).bind(...params).first()) ?? undefined;
    },
    async all(sql, params: SqlBind[] = []) {
      return (await d1.prepare(sql).bind(...params).all()).results ?? [];
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
