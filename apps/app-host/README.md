# app-host

Visual app: React runtime. Main starts as the BuildAutomaton prompt. After the first prompt, the product fills main. There is no chat popup.

Use with [local-cli](../../docs/local-cli/) (`app` mode) or any host that serves the work HTTP API.

Composition: `@buildautomaton/ui-runtime` + layout + app-nav + `buildautomatonUiSet()` (the prompt). Talks to the node runtime over `/api`. App widgets arrive in MCP tool results.

```ts
import { createHostUi } from '@buildautomaton/app-host';
const { App } = createHostUi();
```

Dev: Vite HMR from local-cli. Prod: local-cli serves `apps/app-host/dist`.
