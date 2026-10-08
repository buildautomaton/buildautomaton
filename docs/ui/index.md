# @buildautomaton/ui

The **UI** is the app host. The main screen starts as a blank [buildautomaton](../buildautomaton/) prompt. After that prompt, the same product stays in the sidebar as a widget.

It is a thin Vite host: [`createUi`](../react-runtime/) with a sidebar layout. The main panel is the buildautomaton prompt, then the app that prompt becomes. The widget stays in `sidebar`. It talks to the [runtime](../runtime/) over HTTP (local CLI or a cloud host).

```text
ui  (app host)
  ├── react runtime        sidebar shell
  ├── app surface          main: the running app
  └── buildautomaton       main prompt, sidebar widget
         ↓
      createUi → Vite app
```

```ts
import { createHostUi } from '@buildautomaton/ui';

const { App } = createHostUi();
```

`createAppUi()` is the generic host (prompt until the first `/api/app` transform). The host UI is the shell: nav, main, and the buildautomaton sidebar. The widget calls `/api/work` and `/api/artifacts` on the same server as `/mcp`.

`local-cli app` starts both. **Dev (default)** is Vite HMR at `http://127.0.0.1:5173` so UI source changes apply live. **Prod** (`--prod` or `NODE_ENV=production`) serves `packages/ui/dist` from the runtime HTTP server.

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
npx @buildautomaton/local-cli app --prod --cwd /path/to/repo
```
