# local-cli

Local app: the node runtime plus core plugins and work plugins. Optional app mode also starts [app-host](../app-host/).

Use this when you want BuildAutomaton on your machine. Point it at a repo. It serves MCP tools, the work queue, and (in `app` mode) the blank prompt.

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
```

Composition: `@buildautomaton/runtime` + `coreSet()` (stores, harnesses, sessions, minion tools, HTTP, work) + `appPlugin` in app mode + app-host Vite in dev.

A cloud host would call the same `createRuntime` with Worker store and fetch plugins instead.
