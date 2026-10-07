# App plugin

`appPlugin` turns the process into an app host. It contributes service id `app` and mounts `/` plus `/api/app`.

```ts
import { appPlugin } from '@buildautomaton/plugins';

appPlugin({ runtime, options: { staticRoot } })
```

[Local CLI](../local-cli/) loads this in `app` mode. It serves the [UI](../ui/) in production, or lets Vite own the page in dev.

On Cloudflare, serve static UI with Workers Assets and keep API paths on the Worker. You do not need this plugin there unless you want the same `/api/app` state machine.
