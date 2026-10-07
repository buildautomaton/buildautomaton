# @buildautomaton/local-cli

The **Local CLI** is the local host for the [runtime](../runtime/). A cloud host would call the same `createRuntime` with a different mix of [plugins](../plugins/).

You point it at a repo folder. It starts the runtime with `coreSet()` plus [product-director](../product-director/). [Email](../apps/email.md) is a sample you compose yourself, not in this host. In `app` mode it also loads `appPlugin` and opens the [app UI](../ui/).

```text
local-cli  (local host)
  ├── runtime
  ├── core + director plugins
  └── appPlugin            optional: serve the app
         ↓
      createRuntime → listen
```

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
npx @buildautomaton/local-cli --cwd /path/to/repo
```

`app` starts the runtime and the UI. **Dev is the default**: Vite serves the UI with live HMR (no rebuild). `--prod` (or `NODE_ENV=production`) serves the built UI from the HTTP server. Use that on servers.

Without `app` it is tools and HTTP only (agents still talk to the director queue).

By default it serves HTTP at `http://127.0.0.1:3333`:

```text
/                    app (app mode)
/mcp                 tools
/api/app             app state
/api/director        setup + start session
/api/work            queue
/api/artifacts       reviews
/api/sessions        sessions
/api/work/events     websocket
/director            sidebar widget
```

```bash
local-cli app --cwd /path/to/repo --port 3333
local-cli app --prod --cwd /path/to/repo
local-cli --cwd /path/to/repo --transport stdio
local-cli --transport remote --remote-url https://control.example
```

| Flag | Meaning |
| --- | --- |
| `--cwd <path>` | Working directory for minions |
| `--sessions-dir <path>` | Session files (default `<cwd>/.harness/sessions`) |
| `--backend disk\|stream` | Disk (default) or in-memory stream wrap |
| `--transport http\|stdio\|remote` | How clients connect (HTTP by default) |
| `--port <n>` | HTTP port (`3333`) |
| `--ui-port <n>` | Vite port in app dev (`5173`) |
| `--dev` | Force Vite HMR |
| `--prod` | Serve the built UI (servers) |
| `--mcp-path <path>` | Tools path (`/mcp`) |
| `--remote-url <url>` | Required for `--transport remote` |
| `--verbose` | Log to stderr |

On disk: sessions under `.harness/sessions`, SQLite at `.harness/work.sqlite`, app state at `.harness/app.json`.

Want a different mix, or a cloud host? Call `createRuntime` yourself from the [runtime](../runtime/) package and compose [plugins](../plugins/).
