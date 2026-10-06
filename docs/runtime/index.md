# Runtime

`@buildautomaton/runtime` is the plugin registry, service registry, appliers, start/stop, and `createRuntime`. Stores, sessions, harnesses, and HTTP plugins live in `@buildautomaton/plugins`.

The same host API runs **locally** (the [Local CLI](../local-cli/)) or **in the cloud** ([Cloudflare Workers](./cloud.md)).

```text
Host (local-cli, cloud, test)
  → createRuntime({ plugins })
    → plugins fill their roles
    → handle.start()
```

## Install

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

Needs Node 18+. Built-in plugins also export from `@buildautomaton/plugins/plugins`. Cloudflare hosts should import `@buildautomaton/plugins/worker`.

`coreSet()` is the default bundle: both stores, five agent types, disk sessions, minion tools, and HTTP (or stdio / remote). Add more plugins beside it. `appPlugin` turns the process into an app host (`/` and `/api/app`).

## Plugin categories

The runtime stays small. These plugins (and yours) add the behavior:

- [Stores](./stores.md): files on disk or R2, named SQL schemas on SQLite, D1, or Durable Objects
- [Sessions](./sessions.md): where agent runs are recorded
- [Harnesses](./harnesses.md): Cursor, Codex, Claude Code, and friends
- [Tools](./tools.md): minion tools agents can call
- [HTTP](./http.md): one shared server plugins mount onto
- [Transports](./transports.md): stdio and remote (HTTP is its own kind)
- [Custom plugins](./custom.md): write your own, or a dual runtime + UI pack
