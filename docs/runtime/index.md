# Runtime

`@buildautomaton/runtime` is the **node runtime** (`runtimes/node`). Plugin registry, service registry, start/stop, and `createRuntime`. It does not know stores, sessions, or HTTP. Those ids live in [`@buildautomaton/plugins`](../plugins/). It starts as a process: register plugins, wire services, listen.

The same host API runs **locally** (the [Local CLI](../local-cli/)) or **in the cloud**. The host changes. The registries do not.

```text
Host (local-cli, cloud, test)
  → createRuntime({ plugins })
    → plugin registry
    → service registry
    → handle.start()
```

## Plugin shape

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

One plugin can contribute several services. Several plugins can contribute the same service id. See [Custom plugins](../plugins/custom.md).

## Plugin registry

`createPluginRegistry()` keeps plugins in registration order.

- `register(plugin)` adds a plugin once per name
- `all()` returns every plugin
- `byName(name)` returns one plugin
- `byService(id)` returns every plugin that contributes that service id

`createRuntime` registers the plugins you pass in, then wires each declared service.

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

`createRuntime` calls `define` and `provide` for each contribution before it wires services, so lookup works while a later plugin is being connected.

## How they compose

1. You pass plugins to `createRuntime`. Plugins declare service objects. They do not wire themselves.
2. Each plugin is registered on the plugin registry.
3. Each `services` entry is provided to the service registry.
4. The runtime wires known service ids (stores, sessions, HTTP, tools). A `*` handler covers ids with no specific wirer, once per plugin.
5. `start()` and `stop()` call the same methods on each plugin.

Look up plugins with `slots.pluginRegistry.byService('artifact')`. Look up implementations with `slots.services.implementations('sql-store')` or `slots.services.get('sql-store', (record) => record.options?.schema === 'work')`.

`@buildautomaton/plugins` registers how stores, sessions, harnesses, tools, and HTTP are wired. The runtime package does not know those ids.

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

Needs Node 18+. Built-in plugins and `coreSet()` live in [Plugins](../plugins/).
