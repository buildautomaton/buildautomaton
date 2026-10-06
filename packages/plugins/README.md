# @buildautomaton/plugins

Catalog of runtime plugins: stores, sessions, harnesses, transport, and tools. Pair with `@buildautomaton/runtime` for `createRuntime`.

```bash
npm install @buildautomaton/runtime @buildautomaton/plugins
```

```ts
import { createRuntime } from '@buildautomaton/runtime';
import { coreSet } from '@buildautomaton/plugins';

const runtime = await createRuntime({
  cwd: process.cwd(),
  plugins: coreSet({ options: { cwd: process.cwd() } }),
});
await runtime.start();
```

## Cloudflare Workers

Use `@buildautomaton/plugins/worker` for D1, Durable Objects, and R2. It does not load `node-sqlite3-wasm` or bind a Node port.

```ts
import { createRuntime } from '@buildautomaton/runtime';
import { workerHostPlugins } from '@buildautomaton/plugins/worker';

const handle = await createRuntime({
  cwd: '/',
  plugins: workerHostPlugins({
    d1: { marketplace: env.GLOBAL_DB },
    doOpeners: { 'marketplace-plugin': env.MARKETPLACE_PLUGIN },
    r2: env.MARKETPLACE_FILES,
  }),
});
await handle.start();
return handle.fetch(request);
```

Needs Node 18+ for the local CLI. Worker builds use `nodejs_compat`.
