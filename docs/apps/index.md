# Apps

An **app** is a composition of plugins on the two runtimes, plus a short description of what that composition does. Apps live in [`apps/`](../../apps/).

| App | What it does |
| --- | --- |
| [local-cli](../local-cli/) | Node runtime + core and work plugins. App mode adds security, the data store, workflows, widgets, external MCP, and app-host. |
| [app-host](../app-host/) | React runtime and the BuildAutomaton prompt. |

```text
local-cli  →  createRuntime({ plugins: coreSet + appPlugin + app runtime plugins })
app-host   →  createUi({ plugins: layout + nav + prompt })
```

The runtimes do not know what the app is. Plugins do. Each plugin declares `targetRuntime` (`node` or `react`) instead of living in a runtime-specific folder.

A cloud host would call the same `createRuntime` with Worker store and fetch plugins. Domain apps (inbox, catalog) compose more plugins beside these two.
