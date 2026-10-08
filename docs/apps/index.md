# Apps

An **app** is a composition of plugins on the two runtimes, plus a short description of what that composition does. Apps live in [`apps/`](../../apps/).

| App | What it does |
| --- | --- |
| [local-cli](../local-cli/) | Node runtime + core and work plugins. Optional app mode starts app-host. |
| [app-host](../app-host/) | React runtime + sidebar shell, BuildAutomaton prompt, and widget. |

```text
local-cli  →  createRuntime({ plugins: coreSet + appPlugin })
app-host   →  createUi({ plugins: layout + nav + work UI })
```

The runtimes do not know what the app is. Plugins do. Each plugin declares `targetRuntime` (`node` or `react`) instead of living in a runtime-specific folder.

A cloud host would call the same `createRuntime` with Worker store and fetch plugins. Domain apps (inbox, catalog) compose more plugins beside these two.
