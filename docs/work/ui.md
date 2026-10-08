# BuildAutomaton: app and widget

These plugins declare `targetRuntime: 'react'`. `buildautomatonUiSet()` is the pack. [App-host](../app-host/) already installs it.

| Surface | Panel | What you see |
| --- | --- | --- |
| App | `main` | A blank prompt, then the morphed app |
| BuildAutomaton | overlay | Circle button. Popup with in-progress sessions above the prompt |

The widget talks to the work API on the runtime (usually the local CLI on port 3333). The runtime also serves the same widget at `/buildautomaton` and a page script at `/buildautomaton.js` so the popup can attach to the app.

```ts
import { createAppUi } from '@buildautomaton/plugins/ui';

const { App } = createAppUi();
```

Pass a custom `client` if you need a different HTTP base URL or auth.

The composer sits at the bottom of the widget. The app’s first prompt field works the same way. Both include an agent picker and a model picker. Agents are the ones the ACP plugin detects on this machine, and a sparkle marks each detected agent. Models come from that agent's ACP config options, loaded in the background. Each running session shows a spinner and the elapsed time. Open a session to read its transcript. The transcript keeps updating while the session is in progress.

When the agent records what it built, that work extends the session card. Open the extension to see the artifacts in a modal.

The header folder button opens the working directory, git repo, and branch. Agent detection runs in the background, with a short progress line while it is still going. Install shows in the list only when nothing is detected.
