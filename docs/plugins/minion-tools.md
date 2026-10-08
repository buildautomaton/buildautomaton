# Minion tools

`minionToolsPlugin` is the built-in tools pack (service id `tools`). It lets a parent agent start and watch other agent runs (“minions”). You can register many tools plugins; their lists are merged.

| Tool | What it does |
| --- | --- |
| `spawn_minion` | Start a harness with a prompt; waits until that run finishes |
| `await_minion` | Wait on a minion that already returned |
| `get_minion` | Status for a minion |
| `get_minion_transcript` | Messages from that run |
| `get_minion_context` | Working directory and available harnesses |
| `resolve_minion_request` | Answer a permission or auth prompt |

Spawn already waits, so you do not need to poll. Permission prompts show up on the same open tool call.

```ts
import { minionToolsPlugin } from '@buildautomaton/plugins';

minionToolsPlugin()
```

Skip them in `coreSet()` with `minionTools: false`. Other packages add more tools plugins beside this one. [BuildAutomaton](../work/runtime.md) adds ask/tell.

The same `/mcp` list is passed into ACP sessions as `mcpServers`, so prompt sessions and minions share those tools.
