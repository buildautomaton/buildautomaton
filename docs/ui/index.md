# @buildautomaton/ui

The **UI** is the app host. The main screen is always the **app**. [Product director](../product-director/) sits in the sidebar as a widget — not as tabs, and not as its own home screen.

It is a thin Vite host: [`createUi`](../ui-runtime/) with a sidebar layout, the app surface in `main`, and director UI plugins in `sidebar`. It talks to the [runtime](../runtime/) over HTTP (local CLI or a cloud host).

```text
ui  (app host)
  ├── ui-runtime           kernel: sidebar shell
  ├── app surface          main: the running app
  └── product-director     sidebar: director widget
         ↓
      createUi → Vite app
```

```ts
import { createAppUi } from '@buildautomaton/product-director/ui';

const { App } = createAppUi();
```

The first prompt transforms the app (`/api/app`). After that, `main` stays the app. The widget calls `/api/work` and `/api/artifacts` on the same server as `/mcp`.

Start the runtime first (port 3333), then:

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
pnpm --filter @buildautomaton/ui dev
```

`local-cli app` can also open the app the runtime serves at `/`.
