# meta-harness

One open source app. It starts as a blank surface, then morphs into the software a problem needs.

You describe the problem, or the solution you want. Agents compose open source plugins into that software. The surface becomes the interface. The runtime is the backend. Swap the agents and models. Keep data on your hardware, in your private cloud, or wherever you control it.

Five top-level folders: [`runtimes/`](./runtimes/), [`plugins/`](./plugins/), [`skills/`](./skills/), [`docs/`](./docs/), and [`apps/`](./apps/). [Apps](./docs/apps/) compose plugins with a runtime. The same runtimes run locally or in the cloud. BuildAutomaton is the blank prompt and the sidebar widget.

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
