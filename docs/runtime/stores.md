# Stores

File store is still one root. SQL stores are **named schemas**. You can register many. Each schema is its own database.

## File store

`fileStorePlugin` (service id `file-store`) reads and writes files under a root folder. Sessions and other plugins use it when they need the filesystem.

```ts
fileStorePlugin({ options: { root: process.cwd() } })
```

## SQL schemas

A **schema** is one database plus the migrations that run on it. `sqlStorePlugin` opens a local SQLite file. Plugins set `sqlSchema` and `sqlBackend` (`sqlite`, `do`, or `d1`) so the Cloudflare SQL plugin knows whether that schema is D1 or a Durable Object.

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

## Cloudflare

`cloudSqlStorePlugin` reads `options.backend`:

- `d1`: one D1 database (global listings)
- `do` with `storage`: SQL inside the current Durable Object
- `do` with `namespace`: one Durable Object per `opener.open(key)` (plugin versions)

```ts
import { cloudSqlStorePlugin, r2FileStorePlugin } from '@buildautomaton/plugins/worker';

cloudSqlStorePlugin({ options: { schema: 'marketplace', backend: 'd1', d1: env.GLOBAL_DB } })
cloudSqlStorePlugin({ options: { schema: 'marketplace-plugin', backend: 'do', namespace: env.MARKETPLACE_PLUGIN } })
r2FileStorePlugin({ options: { bucket: env.MARKETPLACE_FILES, prefix: 'marketplace', backend: 'r2' } })
```

`doSqlStorePlugin` remains the in-object `ctx.storage.sql` adapter. Skip file SQL plugins from `coreSet` / app sets (`sql: false`) on Workers. A host app passes your D1 database, Durable Object namespace, and R2 bucket into these store plugins.
