# File store

`fileStorePlugin` (service id `file-store`) reads and writes files under a root folder. [Disk sessions](./disk-sessions.md) and other plugins use it when they need the filesystem.

```ts
import { fileStorePlugin } from '@buildautomaton/plugins';

fileStorePlugin({ options: { root: process.cwd() } })
```

Default root is `runtime.cwd` or `process.cwd()`. `coreSet()` installs this plugin.

On Cloudflare, use the [R2 file store](./r2.md) instead. Same service id. Swap the plugin.
