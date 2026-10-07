import {
  requireAnySqlStore,
  requireFileStore,
  requireSqlOpener,
  type HttpRegistry,
  type PluginInit,
  type ExtensionPlugin,
  type StoreContext,
} from '@buildautomaton/plugins/worker';
import type { MarketplaceImplementation } from '../../types/implementation.js';
import { createMarketplaceBackend } from './backend.js';
import { handleMarketplaceHttp } from './http.js';
import { LISTING_MIGRATIONS } from './listing-migrations.js';

export const MARKETPLACE_SQL_SCHEMA = 'marketplace';
export const MARKETPLACE_PLUGIN_SQL_SCHEMA = 'marketplace-plugin';

export function marketplacePlugin(init: PluginInit = {}): ExtensionPlugin {
  return {
    name: 'marketplace-sql',
    services: [{ id: 'marketplace', options: { schema: MARKETPLACE_SQL_SCHEMA, backend: 'd1' } }],
    sqlSchema: MARKETPLACE_SQL_SCHEMA,
    sqlMigrations: LISTING_MIGRATIONS,
    createFromStores: (stores: StoreContext) =>
      createMarketplaceBackend({
        listings: requireAnySqlStore(stores, MARKETPLACE_SQL_SCHEMA, 'marketplace listings'),
        plugins: requireSqlOpener(stores, MARKETPLACE_PLUGIN_SQL_SCHEMA, 'marketplace plugin'),
        files: requireFileStore(stores, 'marketplace'),
      }),
    contributeHttp(http: HttpRegistry, ctx) {
      const market = ctx.extras[ctx.pluginName] as MarketplaceImplementation | undefined;
      if (!market) return;
      http.addRoute({
        path: '/api/marketplace',
        handler: (req, res, hit) => handleMarketplaceHttp(req, res, market, hit.pathname),
      });
    },
    runtime: init.runtime,
  };
}
