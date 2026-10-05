# Email app

Mail is an app: runtime plugins store messages in the shared SQL database, and a UI plugin puts the inbox in `main`. [Product director](../product-director/) stays in the sidebar.

## Runtime

`emailSet()` installs `emailPlugin` (`kind: 'email'`). It needs a `sql-store`. Locally that is `sqlStorePlugin`. In Cloudflare, use `doSqlStorePlugin` with a Durable Object.

[Local CLI](../local-cli/) already composes these plugins, so `/api/emails` is live when the runtime is up.

```ts
import { createRuntime, coreSet, appPlugin } from '@buildautomaton/runtime';
import { productDirectorSet, directorHttpEndpoints } from '@buildautomaton/product-director';
import { emailSet, emailHttpEndpoints } from '@buildautomaton/email';

const runtime = { cwd, log: console.error };
await createRuntime({
  cwd,
  plugins: [
    ...coreSet({
      options: { cwd, httpEndpoints: [...directorHttpEndpoints(), ...emailHttpEndpoints()] },
      runtime,
    }),
    ...productDirectorSet({ runtime }),
    ...emailSet({ runtime }),
    appPlugin({ runtime }),
  ],
});
```

HTTP: `GET/POST /api/emails`, `GET/PATCH/DELETE /api/emails/:id`. Optional `?folder=inbox`.

Each row: `fromAddr`, `toAddr`, `subject`, `body`, `folder` (`inbox` / `sent` / `draft` / `archive`), `read`, `createdAt`.

## UI

```ts
import { createEmailUi } from '@buildautomaton/email/ui';

const { App } = createEmailUi();
```

That is `layoutPlugin('sidebar')` + the inbox in `main` + the director widget in `sidebar`.
