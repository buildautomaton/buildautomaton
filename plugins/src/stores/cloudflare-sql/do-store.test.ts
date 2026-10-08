import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from '../sqlite/plugin.js';
import { createDoSqlStore } from './do-store.js';
import { doSqlStorePlugin } from './do-plugin.js';
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

describe('Durable Object SQL store', () => {
  it('runs migrations and queries through the DO adapter', () => {
    const memory = sqlStorePlugin({ options: { file: ':memory:' } }).implementation as SqlStore;
    const store = createDoSqlStore(asDo(memory));
    store.migrate('mail', [
      {
        name: '001',
        migrate: (sql) => {
          sql.exec('CREATE TABLE notes (id TEXT PRIMARY KEY, body TEXT)');
          sql.run('INSERT INTO notes (id, body) VALUES (?, ?)', ['n1', 'hello']);
        },
      },
    ]);
    expect(store.get('SELECT body FROM notes WHERE id = ?', ['n1'])).toEqual({ body: 'hello' });
  });

  it('requires storage or an implementation', () => {
    expect(() => doSqlStorePlugin()).toThrow(/storage or implementation/);
    const memory = sqlStorePlugin({ options: { file: ':memory:' } }).implementation as SqlStore;
    expect(doSqlStorePlugin({ options: { storage: asDo(memory) } }).services[0]?.id).toBe('sql-store');
  });
});
