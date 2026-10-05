# Architecture

meta-harness is two small kernels plus plugins. You compose them into an **app**.

| Kernel | Package | What it does |
| --- | --- | --- |
| [Runtime](./runtime/) | `@buildautomaton/runtime` | Starts and stops. Wires server plugins. |
| [UI runtime](./ui-runtime/) | `@buildautomaton/ui-runtime` | Wires UI plugins into an app shell. |

The kernels stay tiny and fast. Almost everything you see — agents, stores, tools, the work queue, the director widget — is a plugin.

## Where the runtime runs

The same runtime runs **locally** or **in the cloud**. The host changes; the kernel and plugin contracts do not.

| Host | Package | Role |
| --- | --- | --- |
| Local | [Local CLI](./local-cli/) | `createRuntime` on your machine. Serves the app and tools. |
| Cloud | your cloud host | Same `createRuntime` call. Swap stores, HTTP, and auth plugins. |

```mermaid
flowchart LR
  local("local-cli")
  cloud("cloud host")
  runtime("runtime kernel")
  uiRuntime("ui-runtime kernel")
  plugins("plugins")
  local --> runtime
  cloud --> runtime
  runtime --> plugins
  uiRuntime --> plugins
```

## Plugins

A package can ship **runtime** plugins, **UI** plugins, or **both**. The kernel only indexes them. The plugin owns the behavior.

[Product director](./product-director/) is the dual example: queue and tools on the runtime, a sidebar widget on the UI runtime.

## What an app looks like

The main screen is always the **app**. Product director is not a dashboard of its own. It is a **sidebar widget** on that app.

```text
┌────────────────────────────────────────────┐
│  nav                                       │
├─────────────────────────────┬──────────────┤
│  main                       │  sidebar     │
│  the app                    │  director    │
│                             │  widget      │
└─────────────────────────────┴──────────────┘
```

[UI](./ui/) is the ready-made host for that shell.

## Try it

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
```

From this repo: `pnpm install && pnpm build && pnpm test`. Public packages publish under `@buildautomaton`.
