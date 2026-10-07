# Stdio transport

`stdioTransportPlugin` (service id `transport`) puts tools on stdin / stdout. Use it when you do not want a localhost HTTP server.

```ts
import { stdioTransportPlugin } from '@buildautomaton/plugins';

stdioTransportPlugin()
```

In `coreSet()`:

```ts
coreSet({ options: { cwd, transport: 'stdio' } })
```

For the usual localhost server with `/mcp`, see [HTTP](./http.md).
