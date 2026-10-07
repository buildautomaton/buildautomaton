# Runtime

`@buildautomaton/runtime` is the plugin registry, service registry, appliers, start/stop, and `createRuntime`. Stores, sessions, harnesses, and HTTP plugins live in `@buildautomaton/plugins`.

The same host API runs **locally** (the [Local CLI](../local-cli/)) or **in the cloud** ([Cloudflare Workers](./cloud.md)).

```text
Host (local-cli, cloud, test)
  → createRuntime({ plugins })
    → plugin registry
    → service registry
    → appliers
    → handle.start()
```

## Plugins

A plugin is a named list of service contributions, plus optional `start` and `stop`. Domain fields (SQL migrations, an HTTP registrar, an opener) can sit on the plugin. The `services` list is what it contributes.

```ts
const ping = {
  name: 'ping-tools',
  services: [{
    id: 'tools',
    implementation: {
      listTools: () => [{ name: 'ping', description: 'Health check', inputSchema: { type: 'object' } }],
      callTool: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
    },
  }],
};
```

One plugin can contribute several services. Several plugins can contribute the same service id. See [Custom plugins](./custom.md) for a full example.

## Plugin registry

`createPluginRegistry()` keeps plugins in registration order.

- `register(plugin)` adds a plugin once per name
- `all()` returns every plugin
- `byName(name)` returns one plugin
- `byService(id)` returns every plugin that contributes that service id

`createRuntime` and `applyPlugins` register the plugins you pass in before anything is applied.

## Services

A contribution is `{ id, interface?, options?, hooks?, implementation? }`.

- `interface` names the contract, for example `{ id: 'sql-store', name: 'SqlStore' }`
- `options` configures that contribution
- `hooks` are callbacks for that contribution
- `implementation` is the object other code calls

A plugin can publish the interface in one contribution and the implementation in another, or put both on one contribution.

## Service registry

`createServiceRegistry()` stores the contract and every contribution.

- `define(id, interface)` records the contract
- `provide(record)` stores one contribution, tagged with the plugin name
- `interfaceOf(id)` returns the contract
- `get(id, match?)` returns the first implementation. `match` filters the record, for example by `options.schema`
- `getAll(id)` returns every record for that id, including interface-only and options-only rows
- `implementations(id)` returns every implementation object

`applyPlugins` calls `define` and `provide` for each contribution before appliers run, so lookup works while a later plugin is being applied.

## How they compose

1. You pass plugins to `createRuntime` or `applyPlugins`.
2. Each plugin is registered on the plugin registry.
3. Each `services` entry is provided to the service registry.
4. Appliers run in `order`. `registerService('sql-store', apply, 20)` handles that id. A `*` applier handles ids with no specific applier, once per plugin.
5. `start()` and `stop()` call the same methods on each plugin.

After that:

- Plugins that contribute a service: `slots.pluginRegistry.byService('artifact')`
- Implementations: `slots.services.implementations('sql-store')`
- One implementation: `slots.services.get('sql-store', (record) => record.options?.schema === 'email')`

`@buildautomaton/plugins` registers the appliers for stores, sessions, harnesses, tools, and HTTP. The runtime package does not know those ids.

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
- [Transports](./transports.md): stdio and remote (HTTP is its own service)
- [Custom plugins](./custom.md): write your own, or a dual runtime + UI pack
