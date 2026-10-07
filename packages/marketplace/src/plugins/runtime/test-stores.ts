import { sqlStorePlugin, type AnySqlStore, type SqlStoreOpener } from '@buildautomaton/plugins';
import { LISTING_MIGRATIONS } from './listing-migrations.js';
import { PLUGIN_MIGRATIONS } from './plugin-migrations.js';
import { memoryFileStore } from './memory-files.js';
import type { MarketplaceStores } from './stores.js';

export function memoryPluginOpener(): SqlStoreOpener {
  const cache = new Map<string, AnySqlStore>();
  return {
    backend: 'sqlite',
    open(key) {
      let sql = cache.get(key);
      if (!sql) {
        sql = sqlStorePlugin({ options: { file: ':memory:', backend: 'sqlite' } }).implementation!;
        void Promise.resolve(sql.migrate('marketplace-plugin', PLUGIN_MIGRATIONS));
        cache.set(key, sql);
      }
      return sql;
    },
  };
}

export function testMarketplaceStores(): MarketplaceStores {
  const listings = sqlStorePlugin({
    options: { file: ':memory:', schema: 'marketplace', backend: 'sqlite' },
  }).implementation!;
  void Promise.resolve(listings.migrate('marketplace-sql', LISTING_MIGRATIONS));
  return { listings, plugins: memoryPluginOpener(), files: memoryFileStore() };
}
