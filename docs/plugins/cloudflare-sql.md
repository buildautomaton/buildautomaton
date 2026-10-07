# Cloudflare SQL store

`cloudSqlStorePlugin` (service id `sql-store`) is the Worker SQL store. Import it from `@buildautomaton/plugins/worker`. It reads `options.backend`:

- `d1`: one D1 database (global rows)
- `do` with `storage`: SQL inside the current Durable Object
- `do` with `namespace`: one Durable Object per `opener.open(key)`

```ts
import { cloudSqlStorePlugin } from '@buildautomaton/plugins/worker';

cloudSqlStorePlugin({ options: { schema: 'marketplace', backend: 'd1', d1: env.GLOBAL_DB } })
cloudSqlStorePlugin({
  options: { schema: 'marketplace-plugin', backend: 'do', namespace: env.MARKETPLACE_PLUGIN },
})
cloudSqlStorePlugin({ options: { schema: 'email', backend: 'do', storage: ctx.storage } })
```

`doSqlStorePlugin` is the in-object adapter for `ctx.storage.sql` when you already have the Durable Object storage.

```ts
import { doSqlStorePlugin } from '@buildautomaton/plugins/worker';

doSqlStorePlugin({ options: { schema: 'email', storage: ctx.storage } })
```

Skip [SQLite](./sqlite-store.md) from `coreSet` / app sets (`sql: false`) on Workers. [Worker host](./worker-host.md) wires D1 and Durable Object openers for you.
