# Custom plugins

The kernel only needs to know the kind. Your plugin owns the behavior. A package can ship **runtime** plugins, **UI** plugins for [`@buildautomaton/ui-runtime`](../ui-runtime/), or **both** (see [product director](../product-director/)).

A tiny tools plugin that answers `ping`:

```ts
const ping: RuntimePlugin = {
  name: 'my-tools',
  kind: 'tools',
  implementation: {
    listTools: () => [{ name: 'ping', description: 'Health check', inputSchema: { type: 'object' } }],
    callTool: async (name) => ({
      content: [{ type: 'text', text: name === 'ping' ? 'ok' : 'unknown' }],
    }),
  },
};
```

You can also wrap a built-in and add hooks:

```ts
cursorHarnessPlugin({ hooks: { onSessionUpdate: console.error } })
```

Packages can introduce new kinds (for example `work`, `artifact`, and `app`). The runtime still indexes them; only the plugin that uses the kind needs to know its shape.

The handle gives you `start`, `stop`, and `engine`. `start` opens the connection; it does not send prompts by itself.
