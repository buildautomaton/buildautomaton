import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from '../sqlite/plugin.js';
import { cloudSqlStorePlugin } from './cloud-plugin.js';
import { createDoSqlRpc } from './do-rpc.js';
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
  };
}

describe('cloudSqlStorePlugin', () => {
  it('uses backend d1 vs do from SqlStoreOptions', () => {
    const memory = sqlStorePlugin({ options: { file: ':memory:' } }).implementation as SqlStore;
    const d1 = cloudSqlStorePlugin({ options: { schema: 'marketplace', backend: 'd1' }, implementation: memory });
    const durable = cloudSqlStorePlugin({ options: { schema: 'plugin', backend: 'do', storage: asDo(memory) } });
    expect(d1.options?.backend).toBe('d1');
    expect(d1.name).toContain('d1');
    expect(durable.options?.backend).toBe('do');
    expect(durable.implementation?.backend).toBe('do');
  });

  it('opens one Durable Object store per key', async () => {
    const memory = sqlStorePlugin({ options: { file: ':memory:' } }).implementation as SqlStore;
    const namespace = {
      idFromName: (name: string) => name,
      get: () => createDoSqlRpc(asDo(memory)),
    };
    const plugin = cloudSqlStorePlugin({ options: { schema: 'marketplace-plugin', backend: 'do', namespace } });
    const store = await plugin.opener!.open('email');
    expect(store.backend).toBe('do');
    await store.exec('CREATE TABLE versions (version TEXT PRIMARY KEY)');
    await store.run('INSERT INTO versions (version) VALUES (?)', ['1.0.0']);
    expect(await store.get('SELECT version FROM versions', [])).toEqual({ version: '1.0.0' });
  });
});
