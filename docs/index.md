# Architecture

meta-harness is two small runtimes plus plugins. You compose them into an **app**.

| Runtime | Package | What it does |
| --- | --- | --- |
| [Runtime](./runtime/) | `@buildautomaton/runtime` | Plugin and service registries, plus lifecycle. |
| [Plugins](./plugins/) | `@buildautomaton/plugins` | Stores, sessions, harnesses, HTTP, and `coreSet`. |
| [UI runtime](./ui-runtime/) | `@buildautomaton/ui-runtime` | Wires UI plugins into an app shell. |

The runtimes stay tiny and fast. Almost everything you see (agents, stores, tools, the work queue, the buildautomaton widget) is a plugin.

## Where the runtime runs

The same runtime runs **locally** or **in the cloud**. The host changes. The runtime and plugin contracts do not.

| Host | Package | Role |
| --- | --- | --- |
| Local | [Local CLI](./local-cli/) | `createRuntime` on your machine. Serves the app and tools. |
| Cloud | your cloud host | Same `createRuntime` call. Swap stores, HTTP, and auth plugins. |

```mermaid
flowchart LR
  local("local-cli")
  cloud("cloud host")
  runtime("runtime")
  uiRuntime("ui-runtime")
  plugins("plugins")
  local --> runtime
  cloud --> runtime
  runtime --> plugins
  uiRuntime --> plugins
```

## Plugins

A package can ship **runtime** plugins, **UI** plugins, or **both**. The runtime only indexes them. The plugin owns the behavior.

[Buildautomaton](./buildautomaton/) is the dual example: queue and tools on the runtime, a prompt screen and a sidebar widget on the UI runtime.

## What an app looks like

The main screen starts as the buildautomaton prompt. After you submit it, the running app fills the main panel and the widget stays in the sidebar.

```text
┌────────────────────────────────────────────┐
│  nav                                       │
├─────────────────────────────┬──────────────┤
│  main                       │  sidebar     │
│  the app                    │  buildautomaton │
│                             │  widget      │
└─────────────────────────────┴──────────────┘
```

[UI](./ui/) is the ready-made host for that shell. [Apps](./apps/) are plugin compositions you assemble in a host.

## Try it

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
```

That is **dev** (Vite HMR). On a server: `local-cli app --prod`. From this repo: `pnpm install && pnpm dev`. Public packages publish under `@buildautomaton`.
