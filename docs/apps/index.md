# Apps

An **app** is a composition of plugins that run on the two runtimes.

```text
Host (local-cli or cloud)
  → createRuntime({ plugins: [core, app plugins, director, …] })
  → createUi({ plugins: [layout, app UI, director widget, …] })
```

The runtimes do not know what the app is. Plugins do.

| Layer | What you pass |
| --- | --- |
| [Runtime](../runtime/) | Registries and lifecycle. It does not know the app. |
| [Plugins](../plugins/) | Store, HTTP, tools, and domain plugins (mail, queue, …) |
| [UI runtime](../ui-runtime/) | Surfaces for `main` (the app) and `sidebar` (director) |

The same app runs **locally** or **in the cloud**. Swap the host and the store plugins. Each SQL [schema](../plugins/sqlite-store.md) is its own SQLite file, or its own Durable Object. Keep the rest.

## Model

```mermaid
flowchart TB
  host["host"]
  runtime["runtime"]
  ui["ui-runtime"]
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

- **Core**: stores, harnesses, sessions, HTTP. Same for every app.
- **App plugins**: the product (data, routes, and the `main` screen).
- **Director**: optional chrome. Sidebar widget only.

## Apps in this repo

| App | Package | Main screen |
| --- | --- | --- |
| [Email](./email.md) | `@buildautomaton/email` | Sample inbox. Compose it into a host. It is not in the default local CLI. |
