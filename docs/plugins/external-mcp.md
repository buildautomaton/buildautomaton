# External MCP

`externalMcpPlugin` (service id `external-mcp`) adds HTTP MCP servers to an ACP session. The agent calls those servers itself. They are not merged into the local tool list.

```ts
import { externalMcpPlugin } from '@buildautomaton/plugins';

externalMcpPlugin({
  runtime,
  options: {
    servers: [{ name: 'stripe', url: 'https://example.test/mcp', headers: [] }],
  },
})
```

Each server has `name`, `url`, optional `type` (default `http`), and optional `headers`. On `session/new`, the runtime sends the local `meta-harness` server first, then these servers. Headers stay on the host config.

Credit metering for marketplace tool calls stays in the app gateway, not in this plugin.
