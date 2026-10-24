# BuildAutomaton: prompt

These plugins declare `targetRuntime: 'react'`. `buildautomatonUiSet()` is the pack. [App-host](../app-host/) already installs it. The set is the prompt only. It does not mount a chat popup, and the runtime does not serve `/buildautomaton` or `/buildautomaton.js`.

| Surface | Panel | What you see |
| --- | --- | --- |
| App | `main` | A blank prompt, then the morphed app |

```ts
import { createAppUi } from '@buildautomaton/plugins/ui';

const { App } = createAppUi();
```

The app's first prompt starts an ACP session through the work API. Later turns continue that session with `POST /api/buildautomaton/session`. Agent and model choices come from the harnesses the runtime detects.

App widgets are a different plugin. They render in the MCP tool result. See [Widgets](../plugins/widgets.md).
