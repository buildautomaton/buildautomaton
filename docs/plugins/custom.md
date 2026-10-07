# Custom plugins

A plugin publishes a service **interface**, an implementation, or both. The [Runtime](../runtime/) page covers how the plugin registry and service registry compose, and how you look them up. `tools`, `sql-store`, and `session` are service ids. A package can ship **runtime** plugins, **UI** plugins for [`@buildautomaton/ui-runtime`](../ui-runtime/), or **both** (see [product director](../product-director/)).

A tiny tools plugin that answers `ping`:

```ts
const ping: RuntimePlugin = {
  name: 'my-tools',
  services: [{
    id: 'tools',
    implementation: {
      listTools: () => [{ name: 'ping', description: 'Health check', inputSchema: { type: 'object' } }],
      callTool: async (name) => ({
        content: [{ type: 'text', text: name === 'ping' ? 'ok' : 'unknown' }],
      }),
    },
  }],
};
```

You can also wrap a built-in and add hooks:

```ts
cursorHarnessPlugin({ hooks: { onSessionUpdate: console.error } })
```

Packages introduce new service ids (for example `work`, `artifact`, and `email`). The runtime indexes them on the service registry. Only the plugin that uses the id needs to know its shape.

The handle gives you `start`, `stop`, and `engine`. `start` opens the connection; it does not send prompts by itself.
