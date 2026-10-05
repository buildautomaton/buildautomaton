# @buildautomaton/ui

The **UI** is the app host. The main screen is always the **app**. [Product director](../product-director/) sits in the sidebar as a widget — not as tabs, and not as its own home screen.

It is a thin Vite host: [`createUi`](../ui-runtime/) with a sidebar layout. The first [app](../apps/) in this repo is [email](../apps/email.md) in `main`, with director UI plugins in `sidebar`. It talks to the [runtime](../runtime/) over HTTP (local CLI or a cloud host).

```text
ui  (app host)
  ├── ui-runtime           kernel: sidebar shell
  ├── app surface          main: the running app
  └── product-director     sidebar: director widget
         ↓
      createUi → Vite app
```

```ts
import { createEmailUi } from '@buildautomaton/email/ui';

const { App } = createEmailUi();
```

`createAppUi()` is the generic host (prompt until the first `/api/app` transform). [Email](../apps/email.md) puts the inbox in `main` instead. The widget calls `/api/work` and `/api/artifacts` on the same server as `/mcp`.

`local-cli app` starts both. **Dev (default)** is Vite HMR at `http://127.0.0.1:5173` so UI source changes apply live. **Prod** (`--prod` or `NODE_ENV=production`) serves `packages/ui/dist` from the runtime HTTP server.

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
npx @buildautomaton/local-cli app --prod --cwd /path/to/repo
```
