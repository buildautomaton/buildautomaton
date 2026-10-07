# Sessions

Session plugins record what happened in an agent run (service id `session`). You need one session plugin. You can wrap it with another.

| Plugin | Role |
| --- | --- |
| [Disk](./disk-sessions.md) | Default local. JSONL while live, then JSON and markdown. |
| [SQL](./sql-sessions.md) | Rows on a named SQL schema. Worker-safe. |
| [Stream](./stream-sessions.md) | In-memory `subscribe()` wrap around another session. |
| [Memory](./memory-sessions.md) | In-memory only. No SQL or filesystem. |

## Ids you will see

| Id | Who owns it | Meaning |
| --- | --- | --- |
| `runId` | you | One prompt turn; use it to cancel |
| `sessionId` | you | Your session record |
| `acpSessionId` | the agent | The agent’s own session id |

ACP `session/new` receives this runtime’s MCP server once HTTP is listening (`http://127.0.0.1:<port>/mcp`). [Buildautomaton](../buildautomaton/runtime.md) prompt sessions use those tools so they can report completed work.
