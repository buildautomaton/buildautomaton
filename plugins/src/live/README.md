# live

**Target runtime:** node

Generic websocket bus on the HTTP transport. `coreSet()` installs it at `ws://…/api/live`. Messages are `{ type, payload }`. Other plugins read `extras.live` and register types with `on`, `publish`, and `welcome`.

The ACP plugin greets on `acp`. Session plugins publish `sessions` when a prompt starts or finishes.
