# Stores

File store is still one root. SQL stores are **named schemas**. You can register many. Each schema is its own database.

## File store

`fileStorePlugin` (`kind: 'file-store'`) reads and writes files under a root folder. Sessions and other plugins use it when they need the filesystem.

```ts
fileStorePlugin({ options: { root: process.cwd() } })
```

## SQL schemas

A **schema** is one Durable Object (or one local SQLite file) plus the migrations that run on it. `sqlStorePlugin` opens that file. Plugins set `sqlSchema` so their migrations land on that object.

| Schema | Default file | Who uses it |
| --- | --- | --- |
| `work` (default) | `<cwd>/.harness/work.sqlite` | Sessions, product director |
| `email` | `<cwd>/.harness/sql/email.sqlite` | Sample email app |

```ts
sqlStorePlugin({ options: { schema: 'email' } })
sqlStorePlugins({ cwd, schemas: ['work', 'email'] })
```

`coreSet()` installs the `work` schema. [Email](../apps/email.md) adds the `email` schema. Other apps add their own.

Migrations use a `__migrations` table. Names are scoped per plugin. Order is guaranteed only inside that plugin.

## Cloudflare Durable Objects

`doSqlStorePlugin` is the same contract, backed by `ctx.storage.sql`. **One Durable Object per schema.** A cloud host passes a storage binding for each name.

```ts
import { doSqlStorePlugin, doSqlStorePlugins } from '@buildautomaton/runtime';

doSqlStorePlugin({ options: { schema: 'work', storage: env.WORK } })
doSqlStorePlugins({ work: env.WORK, email: env.EMAIL })
```

Skip the file SQL plugins from `coreSet` / `emailSet({ sql: false })` and pass the DO plugins instead.
