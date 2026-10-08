# @buildautomaton/app-host

The **app host** is the visual app in [`apps/app-host`](../../apps/app-host/). The main screen starts as a blank [BuildAutomaton](../work/) prompt. After that prompt, the product fills main and the widget stays in the sidebar.

It is a thin Vite host: [`createUi`](../react-runtime/) with a sidebar layout. It talks to the [runtime](../runtime/) over HTTP (local-cli or a cloud host).

```text
app-host
  ├── react runtime        sidebar shell
  ├── app surface          main: the running app
  └── work plugins         prompt + BuildAutomaton widget
         ↓
      createUi → Vite app
```

```ts
import { createHostUi } from '@buildautomaton/app-host';

const { App } = createHostUi();
```

`local-cli app` starts both. **Dev** is Vite HMR at `http://127.0.0.1:5173`. **Prod** serves `apps/app-host/dist`.

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
npx @buildautomaton/local-cli app --prod --cwd /path/to/repo
```
