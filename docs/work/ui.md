# BuildAutomaton: app and widget

These plugins declare `targetRuntime: 'react'`. `buildautomatonUiSet()` is the pack. [App-host](../app-host/) already installs it.

| Surface | Panel | What you see |
| --- | --- | --- |
| App | `main` | A blank prompt, then the morphed app |
| BuildAutomaton | overlay | Circle button. Popup with one session's prompts above the composer |

The widget talks to the work API on the runtime (usually the local CLI on port 3333). The runtime also serves the same widget at `/buildautomaton` and a page script at `/buildautomaton.js` so the popup can attach to the app.

```ts
import { createAppUi } from '@buildautomaton/plugins/ui';

const { App } = createAppUi();
```

Pass a custom `client` if you need a different HTTP base URL or auth.

The composer sits at the bottom of the widget. The app’s first prompt field works the same way. Both include an agent picker and a model picker. Agents are the ones the ACP plugin detects on this machine, and a sparkle marks each detected agent. Models come from that agent's ACP config options, loaded in the background. A follow-up keeps the session's agent and only lets you change the model.

The chat is one ACP session. Rows are the prompts in that session: the first two lines, elapsed time, and how long ago it was sent. Click a prompt to open the transcript. A later prompt continues the same session. The header is one field: click it to pick a session or start a new chat. Hover the session icon for the working directory, git repo, and branch. Click outside the widget to close it. A green or red dot on the circle button and in the open header shows the live websocket to the ACP plugin in the CLI. A spinner on that dot, and on the open session, means a prompt is running.

When the agent records what it built, that work extends the session card. Open the extension to see the artifacts in a modal.

Agent and model menus, the session menu, and the location popover render outside the widget so they are not clipped. Agent detection runs in the background, with a short progress line while it is still going. Install shows in the list only when nothing is detected.
