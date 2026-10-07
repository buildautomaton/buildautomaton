# SQL sessions

`sqlSessionPlugin` stores session records on a named SQL schema (default `work`). Use it on Cloudflare with [Cloudflare SQL](./cloudflare-sql.md) or `doSqlStorePlugin`. It does not touch the filesystem.

```ts
import { sqlSessionPlugin } from '@buildautomaton/plugins';

sqlSessionPlugin({ options: { schema: 'work' } })
```

[Worker host](./worker-host.md) installs this when you pass a `work` Durable Object storage binding.
