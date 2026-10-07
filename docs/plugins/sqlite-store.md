# SQLite store

`sqlStorePlugin` (service id `sql-store`) opens one local SQLite file per **schema**. A schema is one database plus the migrations that run on it.

| Schema | Default file | Who uses it |
| --- | --- | --- |
| `work` (default) | `<cwd>/.harness/work.sqlite` | Sessions, product director |
| `email` | `<cwd>/.harness/sql/email.sqlite` | Sample email app |

```ts
import { sqlStorePlugin, sqlStorePlugins } from '@buildautomaton/plugins';

sqlStorePlugin({ options: { schema: 'email' } })
sqlStorePlugins({ cwd, schemas: ['work', 'email'] })
```

`coreSet()` installs the `work` schema. [Email](../apps/email.md) adds the `email` schema. Other apps add their own.

On Cloudflare, skip this plugin and use [Cloudflare SQL](./cloudflare-sql.md) for the same schemas.
