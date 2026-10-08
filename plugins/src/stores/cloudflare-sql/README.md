# cloudflare SQL

**Target runtime:** node (Workers)

SQL store on D1 or a Durable Object. Use `cloudSqlStorePlugin` or `doSqlStorePlugin` instead of SQLite when the host is a Worker.

Pick D1 for shared/global data. Pick a Durable Object when each schema should own isolated SQL.
