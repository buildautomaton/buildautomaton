# Architecture

One open source app. It starts as a blank surface. You describe a problem, or the solution you want. Agents compose open source components into that software. The surface morphs into the interface. The runtime is the backend behind it.

Use the agents and models you want. Keep data on your own hardware, in your private cloud, or wherever you control it.

BuildAutomaton is how that app is built: two small runtimes plus plugins. You compose them into an **app**. Top-level folders are `runtimes/`, `plugins/`, `skills/`, `docs/`, and `apps/`.

| Runtime | Package | What it does |
| --- | --- | --- |
| [Node runtime](./runtime/) | `@buildautomaton/runtime` | Plugin and service registries, plus process start. |
| [Plugins](./plugins/) | `@buildautomaton/plugins` | Stores, sessions, harnesses, HTTP, and `coreSet`. |
| [React runtime](./react-runtime/) | `@buildautomaton/ui-runtime` | Wires UI plugins into a React app shell. |

The runtimes stay tiny and fast. Almost everything you see (agents, stores, tools, the work queue, app widgets) is a plugin.

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
  uiRuntime("react-runtime")
  plugins("plugins")
  local --> runtime
  cloud --> runtime
  runtime --> plugins
  uiRuntime --> plugins
```

## Plugins

A package can ship **runtime** plugins, **UI** plugins, or **both**. The runtime only indexes them. The plugin owns the behavior.

[Work plugins](./work/) are the queue and the blank prompt. App mode also loads five separate plugins: [security](./plugins/security.md) (users and grants), the [data store](./plugins/data-store.md), [workflows](./plugins/workflows.md), [widgets](./plugins/widgets.md), and [external MCP](./plugins/external-mcp.md) servers. Harnesses and ACP sessions stay in `coreSet()`.

## What an app looks like

The main screen starts as the buildautomaton prompt. After you submit it, the running app fills the main panel. Agents call workflows, the data store, and widgets on the local MCP server. There is no chat popup over the page.

```text
┌────────────────────────────────────────────┐
│  nav                                       │
├────────────────────────────────────────────┤
│  main: the app                             │
│                                            │
└────────────────────────────────────────────┘
```

[App host](./app-host/) is the ready-made shell. [Apps](./apps/) are plugin compositions you assemble in a host.

## Try it

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
```

That is **dev** (Vite HMR). On a server: `local-cli app --prod`. From this repo: `pnpm install && pnpm dev`. Public packages publish under `@buildautomaton`.
