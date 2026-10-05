import type { PluginInit, RuntimePlugin, TransportEndpoint } from '@buildautomaton/runtime';
import { sqlStorePlugin } from '@buildautomaton/runtime';
import { marketplacePlugin, MARKETPLACE_SQL_SCHEMA } from './plugins/runtime/plugin.js';
import { MARKETPLACE_MIGRATIONS } from './plugins/runtime/migrations.js';
import { marketplaceToolsPlugin } from './plugins/tools/plugin.js';

export type MarketplaceSetOptions = {
  /** Local file store for the marketplace schema. Pass `false` on a cloud host that supplies a DO. */
  sql?: boolean;
};

export function marketplaceHttpEndpoints(): TransportEndpoint[] {
  return [{ plugin: 'marketplace-sql', path: '/api/marketplace' }];
}

export function marketplaceSet(init: PluginInit<MarketplaceSetOptions> = {}): RuntimePlugin[] {
  const runtime = init.runtime;
  const sql =
    init.options?.sql === false
      ? []
      : [
          sqlStorePlugin({
            options: { schema: MARKETPLACE_SQL_SCHEMA },
            sqlMigrations: MARKETPLACE_MIGRATIONS,
            runtime,
          }),
        ];
  return [...sql, marketplacePlugin({ runtime }), marketplaceToolsPlugin({ runtime })];
}
