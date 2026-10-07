# Apps

An **app** is a composition of plugins that run on the two runtimes.

```text
Host (local-cli or cloud)
  → createRuntime({ plugins: [core, app plugins, buildautomaton, …] })
  → createUi({ plugins: [layout, app UI, buildautomaton widget, …] })
```

The runtimes do not know what the app is. Plugins do.

| Layer | What you pass |
| --- | --- |
| [Runtime](../runtime/) | Registries and lifecycle. It does not know the app. |
| [Plugins](../plugins/) | Store, HTTP, tools, and domain plugins (mail, queue, …) |
| [UI runtime](../ui-runtime/) | Surfaces for `main` (the app) and `sidebar` (buildautomaton) |

The same app runs **locally** or **in the cloud**. Swap the host and the store plugins. Each SQL [schema](../plugins/sqlite-store.md) is its own SQLite file, or its own Durable Object. That is where the data lives: on your machine, or in a cloud you control.

Agents customize the app for one situation. They start from these open source plugins, then compose and change them. The plugins are a solid starting point. The edges of your problem still get worked out in the app.

## Model

```mermaid
flowchart TB
  host["host"]
  runtime["runtime"]
  ui["ui-runtime"]
  core["core plugins"]
  app["app plugins"]
  buildautomaton["buildautomaton plugins"]
  host --> runtime
  host --> ui
  runtime --> core
  runtime --> app
  runtime --> buildautomaton
  ui --> app
  ui --> buildautomaton
```

- **Core**: stores, harnesses, sessions, HTTP. Same backend pieces for every solution.
- **App plugins**: the product for this situation (data, routes, and the `main` screen).
- **Buildautomaton**: the blank prompt, then the sidebar widget once the surface has morphed.

## Apps

This repo ships the runtimes and plugins. Domain apps (inbox, catalog, and so on) live in the host that deploys them.
