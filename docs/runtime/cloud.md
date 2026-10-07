# Cloudflare Workers

The same `createRuntime` runs on a Worker. SQL plugins set `options.backend` so the Cloudflare SQL plugin can store global rows in D1 and per-entity rows in Durable Objects. Files go through the R2 file store.

`@buildautomaton/plugins/worker` is the entry that stays off `node-sqlite3-wasm` and `node:http` listen.

```ts
import { createRuntime } from '@buildautomaton/runtime';
import { workerHostPlugins } from '@buildautomaton/plugins/worker';

const handle = await createRuntime({
  cwd: '/',
  log: () => {},
  plugins: [
    ...workerHostPlugins({
      d1: { marketplace: env.GLOBAL_DB },
      doOpeners: { 'marketplace-plugin': env.MARKETPLACE_PLUGIN },
      r2: env.MARKETPLACE_FILES,
      r2Prefix: 'marketplace',
      httpEndpoints: [{ plugin: 'marketplace-sql', path: '/api/marketplace' }],
    }),
  ],
});
await handle.start();
return handle.fetch(request);
```

`workerHostPlugins` reads `backend: 'd1' | 'do'` on each SQL schema. `doOpeners` opens one Durable Object per key (one marketplace plugin). `handle.fetch` is a Web `Request` in, `Response` out.

[Marketplace](../apps/marketplace.md) packages that host: `createMarketplaceHost` wires the D1, Durable Object, and R2 store plugins, then the marketplace plugins. Export `MarketplacePluginDO` from `@buildautomaton/marketplace/do`.

Serve static UI with Workers Assets. Keep API paths (`/api/*`, `/mcp`) on the Worker.
