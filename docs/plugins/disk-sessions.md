# Disk sessions

`diskSessionPlugin` (service id `session`) is the default local session plugin. While a run is live it appends to `{id}.jsonl`. When the run finishes it packs that into `{id}.json` and `{id}.md`.

Default folder: `<cwd>/.harness/sessions`. It uses the [file store](./file-store.md), can mirror into SQLite, and can serve `/api/sessions` when HTTP is up.

```ts
import { diskSessionPlugin } from '@buildautomaton/plugins';

diskSessionPlugin({ options: { dir: '.harness/sessions' } })
```

`coreSet()` installs this plugin. On Cloudflare, use [SQL sessions](./sql-sessions.md) or [memory sessions](./memory-sessions.md) instead.
