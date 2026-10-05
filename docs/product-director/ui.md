# Product director: widget

These plugins run inside [`@buildautomaton/ui-runtime`](../ui-runtime/). They fill the **sidebar**. They do not take `main`, and they do not install a tabbed dashboard.

`productDirectorUiSet()` is the pack. The [UI](../ui/) host already installs it next to the app surface.

| Surface | Panel | What you see |
| --- | --- | --- |
| Director widget | `sidebar` | Queue, composer, reviews, and setup |

The widget talks to the work API on the runtime (usually the local CLI on port 3333). The runtime also serves the same widget at `/director` and a page script at `/director.js` so the sidebar can attach to the app.

```ts
import { createAppUi } from '@buildautomaton/product-director/ui';

const { App } = createAppUi();
```

Pass a custom `client` if you need a different HTTP base URL or auth.

Setup (which agents are installed, working directory) lives in the widget, not on a separate director home screen.
