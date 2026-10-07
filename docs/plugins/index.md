# Plugins

`@buildautomaton/plugins` is the catalog of runtime plugins. The [runtime](../runtime/) only indexes them. Each plugin owns a service id: stores, sessions, harnesses, tools, or HTTP.

```ts
import { createRuntime } from '@buildautomaton/runtime';
import { coreSet } from '@buildautomaton/plugins';

const runtime = await createRuntime({
  cwd: process.cwd(),
  plugins: coreSet({ options: { cwd: process.cwd() } }),
});
await runtime.start();
```

`coreSet()` is the default local bundle: [file store](./file-store.md), [SQLite](./sqlite-store.md), five [harnesses](./harnesses.md), [disk sessions](./disk-sessions.md), [minion tools](./minion-tools.md), and [HTTP](./http.md) (or [stdio](./stdio.md) / [remote](./remote.md)). Add more plugins beside it.

Built-in plugins also export from `@buildautomaton/plugins/plugins`. Cloudflare hosts should import `@buildautomaton/plugins/worker`. See [Worker host](./worker-host.md).

## Catalog

| Area | Plugins |
| --- | --- |
| [Stores](./stores.md) | [File](./file-store.md), [SQLite](./sqlite-store.md), [Cloudflare SQL](./cloudflare-sql.md), [R2](./r2.md) |
| [Sessions](./sessions.md) | [Disk](./disk-sessions.md), [SQL](./sql-sessions.md), [Stream](./stream-sessions.md), [Memory](./memory-sessions.md) |
| Agents | [Harnesses](./harnesses.md), [Minion tools](./minion-tools.md) |
| [Transports](./transports.md) | [HTTP](./http.md), [Fetch](./fetch.md), [Stdio](./stdio.md), [Remote](./remote.md) |
| Host | [App](./app.md), [Worker host](./worker-host.md) |
| Your own | [Custom plugins](./custom.md) |

A package can ship **runtime** plugins, **UI** plugins for [`@buildautomaton/ui-runtime`](../ui-runtime/), or **both**. [Buildautomaton](../buildautomaton/) is the dual example.
