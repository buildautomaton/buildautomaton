import { describe, expect, it } from 'vitest';
import { applyPlugins } from './plugin-apply.js';
import { sqlStorePlugin } from '@plugins/stores/sql/plugin.js';
import { pickSqlStore, requireSqlStore } from './pick-sql-store.js';
import { storeContext } from './store-context.js';

const ctx = { cwd: '/', log: () => {} };

describe('pickSqlStore', () => {
  it('keeps work and marketplace schemas isolated', () => {
    const slots = applyPlugins(
      [
        sqlStorePlugin({ options: { schema: 'work', file: ':memory:' } }),
        sqlStorePlugin({ options: { schema: 'marketplace', file: ':memory:' } }),
      ],
      ctx,
    );
    const stores = storeContext(slots);
    stores.sqlStores!.work!.exec('CREATE TABLE work_only (id TEXT)');
    stores.sqlStores!.marketplace!.exec('CREATE TABLE market_only (id TEXT)');
    expect(pickSqlStore(stores, 'work')!.all('SELECT name FROM sqlite_master WHERE type = ?', ['table']).map((r) => r.name)).toContain(
      'work_only',
    );
    expect(pickSqlStore(stores, 'marketplace')!.all('SELECT name FROM sqlite_master WHERE type = ?', ['table']).map((r) => r.name)).toContain(
      'market_only',
    );
    expect(slots.sqlStore).toBe(stores.sqlStores!.work);
  });

  it('falls back to the only store when the named schema is missing', () => {
    const slots = applyPlugins([sqlStorePlugin({ options: { file: ':memory:' } })], ctx);
    expect(requireSqlStore(storeContext(slots), 'email', 'email plugin')).toBe(slots.sqlStore);
  });
});
