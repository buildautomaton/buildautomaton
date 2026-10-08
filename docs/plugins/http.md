# HTTP

`httpTransportPlugin` (service id `http`) starts **one** shared server. Other plugins mount routes and websockets onto it. This is separate from the `transport` service ([stdio](./stdio.md) / [remote](./remote.md)).

Default tools path is `/mcp`. Extra mounts come from `endpoints`:

```ts
import { httpTransportPlugin } from '@buildautomaton/plugins';

httpTransportPlugin({
  options: {
    host: '127.0.0.1',
    port: 3333,
    endpoints: [
      { kind: 'tools', path: '/mcp' },
      { plugin: 'session-disk', path: '/api' },
      { plugin: 'work-sqlite', path: '/api' },
    ],
  },
});
```

`coreSet()` mounts [live](./live.md), buildautomaton work, and sessions at `/api`. The live plugin adds `ws://…/api/live`. Other plugins register message types on that connection.

This is the default path in `coreSet()`. On Cloudflare, use [Fetch](./fetch.md) (or [Worker host](./worker-host.md)). `createRuntime` then exposes `handle.fetch(request)` instead of binding a port.
