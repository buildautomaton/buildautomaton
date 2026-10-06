import { describe, expect, it } from 'vitest';
import { applyPlugins } from '@buildautomaton/runtime';
import { asHost } from '@plugins/host-slots.js';
import { sqlStorePlugin } from '@plugins/stores/sqlite/plugin.js';
import { pickSqlStore, requireSqlStore } from '@plugins/stores/sql-store/pick.js';
import { storeContext } from '@plugins/apply/store-context.js';
import '@plugins/register-services.js';

const ctx = { cwd: '/', log: () => {} };

describe('pickSqlStore', () => {
  it('keeps work and email schemas isolated', () => {
    const slots = applyPlugins(
      [
        sqlStorePlugin({ options: { schema: 'work', file: ':memory:' } }),
        sqlStorePlugin({ options: { schema: 'email', file: ':memory:' } }),
      ],
      ctx,
    );
    const stores = storeContext(slots);
    stores.sqlStores!.work!.exec('CREATE TABLE work_only (id TEXT)');
    stores.sqlStores!.email!.exec('CREATE TABLE email_only (id TEXT)');
    const work = pickSqlStore(stores, 'work') as import('@plugins/stores/sql-store/interface.js').SqlStore;
    const email = pickSqlStore(stores, 'email') as import('@plugins/stores/sql-store/interface.js').SqlStore;
    expect(work.all('SELECT name FROM sqlite_master WHERE type = ?', ['table']).map((r) => r.name)).toContain(
      'work_only',
    );
    expect(email.all('SELECT name FROM sqlite_master WHERE type = ?', ['table']).map((r) => r.name)).toContain(
      'email_only',
    );
    expect(asHost(slots).sqlStore).toBe(stores.sqlStores!.work);
  });

  it('falls back to the only store when the named schema is missing', () => {
    const slots = applyPlugins([sqlStorePlugin({ options: { file: ':memory:' } })], ctx);
    expect(requireSqlStore(storeContext(slots), 'email', 'email plugin')).toBe(asHost(slots).sqlStore);
  });
});
