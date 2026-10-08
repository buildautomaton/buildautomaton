# Plugins

Catalog of open source plugins agents compose into an app. Each plugin folder has a markdown description so an agent can decide whether it fits a problem.

Plugins are **not** split by runtime. Each plugin declares `targetRuntime`: `node` (`@buildautomaton/runtime`) or `react` (`@buildautomaton/ui-runtime`).

## Categories

| Category | When to use |
| --- | --- |
| [stores](./src/stores/) | Persist files or SQL locally or on Cloudflare |
| [session](./src/session/) | Persist or stream agent sessions |
| [harnesses](./src/harnesses/) | Spawn a coding agent (Cursor, Codex, Claude Code, …) |
| [tools](./src/tools/) | MCP tools for minions and other agents |
| [transport](./src/transport/) | HTTP, fetch, stdio, or remote |
| [live](./src/live/) | Typed websocket bus on HTTP |
| [app](./src/app/) | Morphing app HTTP surface |
| [git](./src/git/) | Working directory repo root and branch |
| [work](./src/work/) | BuildAutomaton queue, artifacts, prompt, and widget |

Read a plugin's `README.md` before composing it. Pair node plugins with `createRuntime`. Pair react plugins with `createUi`.
