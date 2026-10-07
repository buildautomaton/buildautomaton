import { sqlStorePlugin, type FileStorePlugin, type RuntimePlugin, type SqlStorePlugin } from '@buildautomaton/plugins';
import { LISTING_MIGRATIONS } from './listing-migrations.js';
import { memoryPluginOpener } from './test-stores.js';
import { memoryFileStore } from './memory-files.js';
import { MARKETPLACE_PLUGIN_SQL_SCHEMA, MARKETPLACE_SQL_SCHEMA } from './plugin.js';
import { PLUGIN_MIGRATIONS } from './plugin-migrations.js';

export function testMarketplaceStorePlugins(): RuntimePlugin[] {
  const listings = sqlStorePlugin({
    options: { file: ':memory:', schema: MARKETPLACE_SQL_SCHEMA, backend: 'sqlite' },
    sqlMigrations: LISTING_MIGRATIONS,
  });
  const openerOptions = { schema: MARKETPLACE_PLUGIN_SQL_SCHEMA, backend: 'sqlite' as const };
  const opener: SqlStorePlugin = {
    name: 'store-sql-opener-marketplace-plugin',
    services: [{ id: 'sql-store', options: openerOptions }],
    options: openerOptions,
    sqlMigrations: PLUGIN_MIGRATIONS,
    opener: memoryPluginOpener(),
  };
  const fileOptions = { backend: 'disk' as const };
  const fileImplementation = memoryFileStore();
  const files: FileStorePlugin = {
    name: 'store-file',
    services: [{ id: 'file-store', options: fileOptions, implementation: fileImplementation }],
    options: fileOptions,
    implementation: fileImplementation,
  };
  return [listings, opener, files];
}
