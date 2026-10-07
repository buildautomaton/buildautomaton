# Stream sessions

`streamSessionPlugin` wraps an existing session so callers can `subscribe()` in memory. It does not replace disk or SQL storage.

```ts
import { streamSessionPlugin } from '@buildautomaton/plugins';

streamSessionPlugin()
```

Turn it on in `coreSet()` with `backend: 'stream'`. Pair it with [disk sessions](./disk-sessions.md) or another session plugin.
