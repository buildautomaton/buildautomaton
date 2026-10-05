# meta-harness

Swap out agents at will.

Open-source agent meta-harness. Two small kernels ([runtime](./docs/runtime/) and [UI runtime](./docs/ui-runtime/)) plus plugins. The same runtime runs locally or in the cloud. The app is always the main screen; product director is a sidebar widget.

**Documentation:** [`docs/`](./docs/) (also on the [BuildAutomaton site](https://buildautomaton.com/meta-harness)).

## Try it

```bash
npx @buildautomaton/local-cli app --cwd /path/to/repo
```

```bash
pnpm install && pnpm build && pnpm test
```

See [docs/license.md](./docs/license.md) for the license. Built on the [Agent Client Protocol](https://agentclientprotocol.com/).
