import {
  requireSqlStore,
  type HttpRegistry,
  type PluginInit,
  type RuntimePlugin,
  type StoreContext,
} from '@buildautomaton/runtime';
import type { MarketplaceImplementation } from '../../types/implementation.js';
import { createMarketplaceBackend } from './backend.js';
import { handleMarketplaceHttp } from './http.js';
import { MARKETPLACE_MIGRATIONS } from './migrations.js';

export const MARKETPLACE_SQL_SCHEMA = 'marketplace';

export function marketplacePlugin(init: PluginInit = {}): RuntimePlugin {
  return {
    name: 'marketplace-sql',
    kind: 'marketplace',
    sqlSchema: MARKETPLACE_SQL_SCHEMA,
    sqlMigrations: MARKETPLACE_MIGRATIONS,
    createFromStores: (stores: StoreContext) =>
      createMarketplaceBackend(requireSqlStore(stores, MARKETPLACE_SQL_SCHEMA, 'marketplace plugin')),
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
