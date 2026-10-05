# Email sample

Email is a **sample app**, not part of the host. [Marketplace](./marketplace.md) lists it so you can compose it yourself. Product director and the marketplace stay in the default runtime. Mail does not.

Runtime plugins store messages in the **`email` SQL schema**. A UI plugin puts the inbox in `main`. [Product director](../product-director/) can still sit in the sidebar if you add it.

## Runtime

`emailSet()` installs a file store for the `email` schema plus `emailPlugin` (`kind: 'email'`). On Cloudflare, pass `emailSet({ options: { sql: false } })` and `doSqlStorePlugin({ options: { schema: 'email', storage } })` so that schema is its own Durable Object.

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

That is `layoutPlugin('sidebar')` + the inbox in `main` + the director widget in `sidebar`. The default [UI](../ui/) host does not include this sample.
