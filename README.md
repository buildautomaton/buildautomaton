# meta-harness

Swap out agents at will.

Open-source app framework. Two small runtimes ([runtime](./docs/runtime/) and [UI runtime](./docs/ui-runtime/)) plus plugins. [Apps](./docs/apps/) are compositions of those plugins. The same runtime runs locally or in the cloud. Buildautomaton is the prompt screen and the sidebar widget.

**Documentation:** [`docs/`](./docs/) (also on the [BuildAutomaton site](https://buildautomaton.com/meta-harness)).

## Try it

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
```

That opens the app in **dev** (Vite HMR). Servers use `local-cli app --prod`.

```bash
pnpm install && pnpm dev
```

See [docs/license.md](./docs/license.md) for the license. Built on the [Agent Client Protocol](https://agentclientprotocol.com/).
