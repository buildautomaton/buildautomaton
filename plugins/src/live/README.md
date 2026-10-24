# live

**Target runtime:** node

Generic websocket bus on the HTTP transport. `coreSet()` installs it at `ws://…/api/live`. Messages are `{ type, payload }`. Other plugins read `extras.live` and register types with `on`, `publish`, and `welcome`.

The ACP plugin greets on `acp`. Session plugins publish `sessions` when a prompt starts or finishes. The work queue publishes `work`. The UI opens one socket to the CLI (not through the Vite proxy) and reconnects if the handshake is still opening when the page remounts.
