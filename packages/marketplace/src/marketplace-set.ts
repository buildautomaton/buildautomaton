import { fileStorePlugin, sqlStorePlugin, type PluginInit, type RuntimePlugin } from '@buildautomaton/plugins';
import { MARKETPLACE_SQL_SCHEMA } from './plugins/runtime/plugin.js';
import { LISTING_MIGRATIONS } from './plugins/runtime/listing-migrations.js';
import { marketplaceCloudSet } from './marketplace-cloud.js';
import { sqliteOpenerPlugin } from './local-opener.js';
import type { MarketplaceSetOptions } from './marketplace-options.js';

export type { MarketplaceSetOptions } from './marketplace-options.js';
export { marketplaceCloudSet, marketplaceHttpEndpoints } from './marketplace-cloud.js';

export function marketplaceSet(init: PluginInit<MarketplaceSetOptions> = {}): RuntimePlugin[] {
  const runtime = init.runtime;
  const cwd = runtime?.cwd ?? process.cwd();
  if (init.options?.sql === false) return marketplaceCloudSet({ runtime });
  return [
    sqlStorePlugin({
      options: { schema: MARKETPLACE_SQL_SCHEMA, backend: 'sqlite' },
      sqlMigrations: LISTING_MIGRATIONS,
      runtime,
    }),
    sqliteOpenerPlugin({ runtime }),
    fileStorePlugin({
      options: { root: `${cwd}/.harness/marketplace-files`, backend: 'disk' },
      runtime,
    }),
    ...marketplaceCloudSet({ runtime }),
  ];
}
