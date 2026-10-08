# Buildautomaton: app and widget

These plugins run inside [`@buildautomaton/ui-runtime`](../react-runtime/). `buildautomatonUiSet()` is the pack. The [UI](../ui/) host already installs it.

| Surface | Panel | What you see |
| --- | --- | --- |
| App | `main` | A blank prompt, then the morphed app |
| Buildautomaton | `sidebar` | Prompt field, in-progress tasks, reviews, and setup |

The widget talks to the work API on the runtime (usually the local CLI on port 3333). The runtime also serves the same widget at `/buildautomaton` and a page script at `/buildautomaton.js` so the sidebar can attach to the app.

```ts
import { createAppUi } from '@buildautomaton/plugins/ui';

const { App } = createAppUi();
```

Pass a custom `client` if you need a different HTTP base URL or auth.

The composer starts a session. In-progress work stays in the feed until the agent reports what was built. The app’s first prompt field does the same.

Setup (which agents are installed, working directory) lives in the widget, not on a separate home screen.
