import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from '../sqlite/plugin.js';
import { doSqlStorePlugins } from './do-sql-store-plugins.js';
import type { DoSqlBackend } from './do-storage.js';
import type { SqlStore } from '@plugins/stores/sql-store/interface.js';
function asDo(sql: SqlStore): DoSqlBackend {
  return {
    sql: {
      exec(query, ...bindings) {
        const text = query.trim().toLowerCase();
        if (text.startsWith('select') || text.startsWith('pragma')) {
          return { toArray: () => sql.all(query, bindings) };
        }
        if (bindings.length) sql.run(query, bindings);
        else sql.exec(query);
        return { toArray: () => [] };
      },
    },
    transactionSync: (fn) => sql.transaction(fn),
  };
}

describe('doSqlStorePlugins', () => {
  it('builds one Durable Object store plugin per schema', () => {
    const work = sqlStorePlugin({ options: { file: ':memory:' } }).implementation as SqlStore;
    const email = sqlStorePlugin({ options: { file: ':memory:' } }).implementation as SqlStore;
    const plugins = doSqlStorePlugins({ work: asDo(work), email: asDo(email) });
    expect(plugins.map((plugin) => `${plugin.options?.schema}:${plugin.name}`)).toEqual([
      'work:store-sql-do',
      'email:store-sql-do-email',
    ]);
  });
});
