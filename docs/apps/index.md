# Apps

An **app** is a composition of plugins that run on the two kernels.

```text
Host (local-cli or cloud)
  → createRuntime({ plugins: [core, app plugins, director, …] })
  → createUi({ plugins: [layout, app UI, director widget, …] })
```

The kernels do not know what the app is. Plugins do.

| Layer | What you pass |
| --- | --- |
| [Runtime](../runtime/) | Store, HTTP, tools, and domain plugins (mail, queue, …) |
| [UI runtime](../ui-runtime/) | Surfaces for `main` (the app) and `sidebar` (director) |

The same app runs **locally** or **in the cloud**. Swap the host and the store plugin (`sqlStorePlugin` on disk, `doSqlStorePlugin` on Cloudflare Durable Objects). Keep the rest.

## Model

```mermaid
flowchart TB
  host["host"]
  runtime["runtime kernel"]
  ui["ui-runtime kernel"]
  core["core plugins"]
  app["app plugins"]
  director["product-director plugins"]
  host --> runtime
  host --> ui
  runtime --> core
  runtime --> app
  runtime --> director
  ui --> app
  ui --> director
```

- **Core** — stores, harnesses, sessions, HTTP. Same for every app.
- **App plugins** — the product: data, routes, and the `main` screen.
- **Director** — optional chrome. Sidebar widget only.

## Apps in this repo

| App | Package | Main screen |
| --- | --- | --- |
| [Email](./email.md) | `@buildautomaton/email` | Inbox stored in SQL |
