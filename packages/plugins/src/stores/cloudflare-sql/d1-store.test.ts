import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from '../sqlite/plugin.js';
import { createD1SqlStore } from './d1-store.js';
import type { D1DatabaseLike, D1PreparedLike } from './d1-types.js';
import type { SqlBind, SqlStore } from '@plugins/stores/sql-store/interface.js';
function asD1(sql: SqlStore): D1DatabaseLike {
  function prepared(query: string, params: SqlBind[]): D1PreparedLike {
    return {
      bind: (...next) => prepared(query, next),
      all: async () => ({ results: sql.all(query, params) }),
      first: async () => sql.get(query, params) ?? null,
      run: async () => {
        sql.run(query, params);
      },
    };
  }
  return {
    prepare: (query) => prepared(query, []),
    exec: async (query) => {
      sql.exec(query);
    },
  };
}

describe('D1 SQL store', () => {
  it('runs migrations and queries through the D1 adapter', async () => {
    const memory = sqlStorePlugin({ options: { file: ':memory:' } }).implementation as SqlStore;
    const store = createD1SqlStore(asD1(memory));
    expect(store.backend).toBe('d1');
    await store.migrate('mail', [
      {
        name: '001',
        migrate: (next) => {
          next.exec('CREATE TABLE notes (id TEXT PRIMARY KEY, body TEXT)');
          next.run('INSERT INTO notes (id, body) VALUES (?, ?)', ['n1', 'hello']);
        },
      },
    ]);
    expect(await store.get('SELECT body FROM notes WHERE id = ?', ['n1'])).toEqual({ body: 'hello' });
  });
});
