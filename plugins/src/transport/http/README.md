# HTTP / fetch transport

**Target runtime:** node

HTTP transport for MCP, REST, and websockets.

- `httpTransportPlugin` binds a Node port (local-cli, servers).
- `fetchTransportPlugin` does not bind a port (Cloudflare Workers `handle.fetch`).

Use stdio or remote instead if this process should not serve HTTP.
