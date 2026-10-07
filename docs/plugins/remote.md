# Remote transport

`remoteTransportPlugin` (service id `transport`) registers with a control plane. Pass `remoteUrl` or a custom adapter.

```ts
import { remoteTransportPlugin } from '@buildautomaton/plugins';

remoteTransportPlugin({
  implementation: createHttpRemoteAdapter('https://control.example'),
})
```

In `coreSet()`:

```ts
coreSet({ options: { cwd, transport: 'remote', remoteUrl: 'https://control.example' } })
```

For the usual localhost server with `/mcp`, see [HTTP](./http.md).
