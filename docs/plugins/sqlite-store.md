# SQLite store

`sqlStorePlugin` (service id `sql-store`) opens one local SQLite file per **schema**. A schema is one database plus the migrations that run on it.

| Schema | Default file | Who uses it |
| --- | --- | --- |
| `work` (default) | `<cwd>/.harness/work.sqlite` | Sessions, buildautomaton |

```ts
import { sqlStorePlugin, sqlStorePlugins } from '@buildautomaton/plugins';

sqlStorePlugin({ options: { schema: 'work' } })
sqlStorePlugins({ cwd, schemas: ['work'] })
```

`coreSet()` installs the `work` schema. Apps add their own schemas.

On Cloudflare, skip this plugin and use [Cloudflare SQL](./cloudflare-sql.md) for the same schemas.
