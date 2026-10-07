import {
  cloudSqlStorePlugin,
  r2FileStorePlugin,
  type PluginRuntimeContext,
  type RuntimePlugin,
} from '@buildautomaton/plugins/worker';
import { LISTING_MIGRATIONS } from './plugins/runtime/listing-migrations.js';
import { PLUGIN_MIGRATIONS } from './plugins/runtime/plugin-migrations.js';
import { MARKETPLACE_PLUGIN_SQL_SCHEMA, MARKETPLACE_SQL_SCHEMA } from './plugins/runtime/plugin.js';
import { filesIsR2, listingsIsD1, pluginsIsNamespace, type MarketplaceHostBindings } from './host-bindings.js';

export function marketplaceStorePlugins(
  bindings: MarketplaceHostBindings,
  runtime?: PluginRuntimeContext,
): RuntimePlugin[] {
  const listings = listingsIsD1(bindings.listings)
    ? cloudSqlStorePlugin({
        options: { schema: MARKETPLACE_SQL_SCHEMA, backend: 'd1', d1: bindings.listings },
        sqlMigrations: LISTING_MIGRATIONS,
        runtime,
      })
    : cloudSqlStorePlugin({
        options: { schema: MARKETPLACE_SQL_SCHEMA, backend: bindings.listings.backend ?? 'sqlite' },
        implementation: bindings.listings,
        sqlMigrations: LISTING_MIGRATIONS,
        runtime,
      });
  const plugins = pluginsIsNamespace(bindings.plugins)
    ? cloudSqlStorePlugin({
        options: { schema: MARKETPLACE_PLUGIN_SQL_SCHEMA, backend: 'do', namespace: bindings.plugins },
        sqlMigrations: PLUGIN_MIGRATIONS,
        runtime,
      })
    : cloudSqlStorePlugin({
        options: { schema: MARKETPLACE_PLUGIN_SQL_SCHEMA, backend: bindings.plugins.backend ?? 'do' },
        opener: bindings.plugins,
        sqlMigrations: PLUGIN_MIGRATIONS,
        runtime,
      });
  const files = filesIsR2(bindings.files)
    ? r2FileStorePlugin({ options: { bucket: bindings.files, prefix: 'marketplace', backend: 'r2' }, runtime })
    : r2FileStorePlugin({ options: { backend: 'r2' }, implementation: bindings.files, runtime });
  return [listings, plugins, files];
}
