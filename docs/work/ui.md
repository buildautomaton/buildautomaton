# BuildAutomaton: app and widget

These plugins declare `targetRuntime: 'react'`. `buildautomatonUiSet()` is the pack. [App-host](../app-host/) already installs it.

| Surface | Panel | What you see |
| --- | --- | --- |
| App | `main` | A blank prompt, then the morphed app |
| BuildAutomaton | overlay | Circle button. Popup with a prompt, disk sessions, and setup |

The widget talks to the work API on the runtime (usually the local CLI on port 3333). The runtime also serves the same widget at `/buildautomaton` and a page script at `/buildautomaton.js` so the popup can attach to the app.

```ts
import { createAppUi } from '@buildautomaton/plugins/ui';

const { App } = createAppUi();
```

Pass a custom `client` if you need a different HTTP base URL or auth.

The composer starts a session. The app’s first prompt field does the same. Each session shows a spinner while it runs, and the elapsed time. Open a session to read its transcript from the disk session store. The transcript keeps updating while the session is in progress.

When the agent records what it built, that work extends the session card. Open the extension to see the artifacts in a modal.

Setup (which agents are installed, working directory) lives in the widget, not on a separate home screen.
