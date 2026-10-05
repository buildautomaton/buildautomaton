# Stores

Store plugins hold data on disk. The runtime expects at most one of each kind.

## File store

`fileStorePlugin` (`kind: 'file-store'`) reads and writes files under a root folder. Sessions and other plugins use it when they need the filesystem.

```ts
fileStorePlugin({ options: { root: process.cwd() } })
```

## SQL store

`sqlStorePlugin` (`kind: 'sql-store'`) opens one shared SQLite database. Other plugins add their own tables through migrations. Default file: `<cwd>/.harness/work.sqlite`.

```ts
sqlStorePlugin({ options: { file: '/path/to/work.sqlite' } })
```

Migrations use a `__migrations` table. Names are scoped per plugin. Order is guaranteed only inside that plugin.

## Typical layout

```text
.harness/
  sessions/     often via the file store
  work.sqlite   sql-store
```

## Cloudflare Durable Objects

`doSqlStorePlugin` (`kind: 'sql-store'`) is the same contract, backed by `ctx.storage.sql` on a Durable Object. Other plugins keep their migrations. Use this on a cloud host instead of the file store.

```ts
import { doSqlStorePlugin } from '@buildautomaton/runtime';

doSqlStorePlugin({ options: { storage: ctx.storage } })
```

`coreSet()` installs the file SQL store. A cloud host skips that and passes `doSqlStorePlugin` instead.
