# app-host

Visual app: React runtime with a sidebar shell. Main starts as the BuildAutomaton prompt. After the first prompt, the product fills main and the widget stays in the sidebar.

Use with [local-cli](../local-cli/) (`app` mode) or any host that serves the work HTTP API.

Composition: `@buildautomaton/ui-runtime` + layout + app-nav + `buildautomatonUiSet()` (prompt + sidebar). Talks to the node runtime over `/api` and `/buildautomaton`.

```ts
import { createHostUi } from '@buildautomaton/app-host';
const { App } = createHostUi();
```

Dev: Vite HMR from local-cli. Prod: local-cli serves `apps/app-host/dist`.
