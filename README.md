# meta-harness

One open source app. It starts as a blank surface, then morphs into the software a problem needs.

You describe the problem, or the solution you want. Agents compose open source plugins into that software. The surface becomes the interface. The runtime is the backend. Swap the agents and models. Keep data on your hardware, in your private cloud, or wherever you control it.

Two small runtimes in [`runtimes/`](./runtimes/) ([node](./docs/runtime/) and [React](./docs/react-runtime/)) plus plugins. [Apps](./docs/apps/) are compositions of those plugins. The same runtimes run locally or in the cloud. Buildautomaton is the blank prompt and the sidebar widget.

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
