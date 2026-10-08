# Live

`livePlugin` (service id `live`) opens one websocket on the [HTTP](./http.md) server. Other plugins register message types on that connection. `coreSet()` installs it at `/api/live`.

```ts
import { livePlugin } from '@buildautomaton/plugins';

livePlugin({ runtime });
```

The hub is `extras.live`. Messages are `{ type, payload }`. A plugin that wants a channel calls `welcome` (sent to each new socket), `publish` (broadcast), and `on` (inbound).

The [ACP](./harnesses.md) plugin greets with `acp`. Session plugins publish `sessions` when status changes. The chat widget uses those types for the online indicator and running progress.
