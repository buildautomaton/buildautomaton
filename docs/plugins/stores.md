# Stores

Store plugins publish `file-store` or `sql-store`. You can register many. SQL stores are **named schemas**. Each schema is its own database.

The [runtime](../runtime/) looks them up by service id and `options.schema`. Plugins set `sqlSchema` and `sqlBackend` (`sqlite`, `do`, or `d1`) so the Cloudflare SQL plugin knows whether that schema is D1 or a Durable Object.

| Plugin | Service | Backend |
| --- | --- | --- |
| [File store](./file-store.md) | `file-store` | Disk folder |
| [SQLite store](./sqlite-store.md) | `sql-store` | One `.sqlite` file per schema |
| [Cloudflare SQL](./cloudflare-sql.md) | `sql-store` | D1 or Durable Objects |
| [R2 files](./r2.md) | `file-store` | One R2 bucket |

`coreSet()` installs the file store and the `work` SQLite schema. Skip file SQL plugins (`sql: false` on app sets) on Workers and pair [Cloudflare SQL](./cloudflare-sql.md) instead.

Migrations use a `__migrations` table. Names are scoped per plugin. Order is guaranteed only inside that plugin.
