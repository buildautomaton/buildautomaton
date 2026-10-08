# Transports

Transport plugins open a channel to the runtime. [HTTP](./http.md) is its own service (`http`). Stdio and remote use service id `transport`.

| Plugin | Service | Channel |
| --- | --- | --- |
| [HTTP](./http.md) | `http` | One shared localhost server. Plugins mount routes. |
| [Fetch](./fetch.md) | `http` | Same routes, no listen. `handle.fetch(request)` on Workers. |
| [Stdio](./stdio.md) | `transport` | Tools on stdin / stdout |
| [Remote](./remote.md) | `transport` | Register with a control plane |
| [Live](./live.md) | `live` | One typed websocket on the HTTP server |

`coreSet()` installs HTTP by default. Pass `transport: 'stdio'` or `transport: 'remote'` to swap. [Live](./live.md) mounts `/api/live` on that HTTP server so plugins can register message types.
