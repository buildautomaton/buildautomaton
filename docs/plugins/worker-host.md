# Worker host

`workerHostPlugins` is the Cloudflare composition: [Cloudflare SQL](./cloudflare-sql.md), optional [R2](./r2.md), [SQL](./sql-sessions.md) or [memory](./memory-sessions.md) sessions, [Fetch](./fetch.md), and ACP. Import it from `@buildautomaton/plugins/worker`. That entry stays off `node-sqlite3-wasm` and `node:http` listen.

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

It reads `backend: 'd1' | 'do'` on each SQL schema. `doOpeners` opens one Durable Object per key. `handle.fetch` is a Web `Request` in, `Response` out.

Pass any of `security`, `dataStore`, `workflows`, `widgets`, or `externalMcp` to include that app-runtime plugin. Omit the field and the plugin stays out, so a host that only needs sessions is unchanged. The SQL schema is still `work` when you use the shared store. Harnesses are not in this bundle. A cloud app that must spawn an agent still needs a host that can run them.

```ts
...workerHostPlugins({
  d1: { work: env.APP_DB },
  security: { workspaceId: 'app' },
  dataStore: { workspaceId: 'app', mutations: [] },
  workflows: { workflows: [] },
  widgets: { widgets: [] },
  externalMcp: { servers: [] },
})
```

A host app wires these store plugins, then its own domain plugins. Export any Durable Object classes the openers call. Serve static UI with Workers Assets. Keep API paths (`/api/*`, `/mcp`) on the Worker.
