# @buildautomaton/runtime

Plugin registry, service registry, and `createRuntime`. Plugin implementations live in `@buildautomaton/plugins`.

```bash
npm install @buildautomaton/runtime @buildautomaton/plugins
```

```ts
import { createRuntime } from '@buildautomaton/runtime';
import { coreSet } from '@buildautomaton/plugins';

const runtime = await createRuntime({
  cwd: process.cwd(),
  plugins: coreSet({ options: { cwd: process.cwd() } }),
});
await runtime.start();
```

Needs Node 18+.
