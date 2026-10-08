# sqlite store

**Target runtime:** node

On-disk SQLite (`sql-store`). Default local persistence for work, sessions, and app data. One file per schema (default `<cwd>/.harness/work.sqlite`).

Not for Workers. Use Cloudflare SQL (D1 or Durable Object) there.
