# Fetch transport

`fetchTransportPlugin` (service id `http`) is the Worker HTTP plugin. It uses the same route registry as [HTTP](./http.md), but it does not bind a Node port.

```ts
import { fetchTransportPlugin } from '@buildautomaton/plugins/worker';

fetchTransportPlugin({
  options: { endpoints: [{ plugin: 'marketplace-sql', path: '/api/marketplace' }] },
})
```

After `createRuntime`, call `handle.start()` and return `handle.fetch(request)`. [Worker host](./worker-host.md) installs this plugin for you.
