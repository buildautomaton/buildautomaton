# Marketplace

Marketplace is a catalog of plugins and app compositions. Runtime plugins store listings, per-plugin SQL, and source files. A UI plugin puts the catalog in `main`.

The plugins live in this repo. A host only packages the static UI and deploys the Worker.

## Runtime

`marketplaceSet()` installs file SQLite for listings, a SQLite opener for each plugin, a disk file store, and the marketplace plugins.

```ts
import { createRuntime, coreSet } from '@buildautomaton/plugins';
import { marketplaceSet, marketplaceHttpEndpoints } from '@buildautomaton/marketplace';

const runtime = { cwd, log: console.error };
await createRuntime({
  cwd,
  plugins: [
    ...coreSet({
      options: { cwd, httpEndpoints: marketplaceHttpEndpoints() },
      runtime,
    }),
    ...marketplaceSet({ runtime }),
  ],
});
```

HTTP: `GET/POST /api/marketplace`, `GET/PATCH/DELETE /api/marketplace/:id`, `GET /api/marketplace/:id/source`.

## Cloudflare

Skip the file stores and pair the marketplace plugins with the Cloudflare store plugins. Listings sit in D1. Each published plugin is its own Durable Object. Source files sit in R2.

```ts
import { createMarketplaceHost } from '@buildautomaton/marketplace';
import { MarketplacePluginDO } from '@buildautomaton/marketplace/do';

export { MarketplacePluginDO };

const handle = await createMarketplaceHost({
  listings: env.GLOBAL_DB,
  plugins: env.MARKETPLACE_PLUGIN,
  files: env.MARKETPLACE_FILES,
});
await handle.start();
return handle.fetch(request);
```

`createMarketplaceHost` calls `cloudSqlStorePlugin` (`backend: 'd1'` and `backend: 'do'`) and `r2FileStorePlugin`, then `marketplaceCloudSet()`. `MarketplacePluginDO` is the Durable Object class those openers call.

## UI

```ts
import { createMarketplaceUi } from '@buildautomaton/marketplace/ui';

const { App } = createMarketplaceUi();
```

That is `layoutPlugin('sidebar')`, the catalog in `main`, and the director widget in `sidebar`.
