# @buildautomaton/runtime

The runtime is a **small kernel**. It does not ship as a finished app. You pass in plugins, it wires them together, and you get a handle you can start and stop.

The same kernel runs **locally** (the [Local CLI](../local-cli/)) or **in the cloud**. Hosts differ; `createRuntime` and the plugin kinds stay the same.

```text
Host (local-cli, cloud, test)
  → createRuntime({ plugins })
  → plugins fill their roles
  → handle.start()
```

## Install

```bash
npm install @buildautomaton/runtime
```

```ts
import { createRuntime, coreSet } from '@buildautomaton/runtime';

const runtime = await createRuntime({
  cwd: process.cwd(),
  plugins: coreSet({ options: { cwd: process.cwd() } }),
});
await runtime.start();
```

Needs Node 18+. Built-in plugins also export from `@buildautomaton/runtime/plugins`.

`coreSet()` is the default bundle: both stores, five agent types, disk sessions, minion tools, and HTTP (or stdio / remote). Add more plugins beside it. `appPlugin` turns the process into an app host (`/` and `/api/app`).

## Plugin categories

The kernel stays small. These plugins (and yours) add the behavior:

- [Stores](./stores.md) — files on disk and shared SQLite
- [Sessions](./sessions.md) — where agent runs are recorded
- [Harnesses](./harnesses.md) — Cursor, Codex, Claude Code, and friends
- [Tools](./tools.md) — minion tools agents can call
- [HTTP](./http.md) — one shared server plugins mount onto
- [Transports](./transports.md) — stdio and remote (HTTP is its own kind)
- [Custom plugins](./custom.md) — write your own, or a dual runtime + UI pack
