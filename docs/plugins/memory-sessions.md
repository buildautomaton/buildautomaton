# Memory sessions

`memorySessionPlugin` keeps sessions in memory. It is Worker-safe: no SQL and no filesystem.

```ts
import { memorySessionPlugin } from '@buildautomaton/plugins';

memorySessionPlugin()
```

[Worker host](./worker-host.md) uses this when there is no `work` Durable Object storage. Prefer [SQL sessions](./sql-sessions.md) when you need records to survive the isolate.
