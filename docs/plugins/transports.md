# Transports

Transport plugins open a channel to the runtime. [HTTP](./http.md) is its own service (`http`). Stdio and remote use service id `transport`.

| Plugin | Service | Channel |
| --- | --- | --- |
| [HTTP](./http.md) | `http` | One shared localhost server. Plugins mount routes. |
| [Fetch](./fetch.md) | `http` | Same routes, no listen. `handle.fetch(request)` on Workers. |
| [Stdio](./stdio.md) | `transport` | Tools on stdin / stdout |
| [Remote](./remote.md) | `transport` | Register with a control plane |

`coreSet()` installs HTTP by default. Pass `transport: 'stdio'` or `transport: 'remote'` to swap.
