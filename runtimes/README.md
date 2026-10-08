# Runtimes

Two small runtimes. Both are plugin and service based. They start differently and do different things by default.

| Runtime | Package | Default start | Default job |
| --- | --- | --- | --- |
| [Node](./node/) | `@buildautomaton/runtime` | `createRuntime` then `handle.start()` | Register plugins, wire services, listen (HTTP/MCP) |
| [React](./react/) | `@buildautomaton/ui-runtime` | `createUi({ plugins })` | Compose UI plugins into a dashboard shell |

The runtimes do not know your product. Plugins do. A host (local-cli, a Worker, a Vite app) picks the runtime, passes plugins, and starts it.

```ts
import { createRuntime } from '@buildautomaton/runtime';
import { createUi, layoutPlugin } from '@buildautomaton/ui-runtime';
```
