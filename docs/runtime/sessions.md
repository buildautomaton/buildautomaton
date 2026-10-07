# Sessions

Session plugins record what happened in an agent run. You need one session plugin (you can wrap it with another).

## Disk sessions

`diskSessionPlugin` (service id `session`) is the default. While a run is live it appends to `{id}.jsonl`. When the run finishes it packs that into `{id}.json` and `{id}.md`.

Default folder: `<cwd>/.harness/sessions`. It uses the file store, can mirror into SQLite, and can serve `/api/sessions` when HTTP is up.

```ts
diskSessionPlugin({ options: { dir: '.harness/sessions' } })
```

## SQL sessions

`sqlSessionPlugin` stores session records on a named SQL schema (default `work`). Use it on Cloudflare with `doSqlStorePlugin`. It does not touch the filesystem.

```ts
sqlSessionPlugin({ options: { schema: 'work' } })
```

## Stream sessions

`streamSessionPlugin` wraps an existing session so callers can `subscribe()` in memory. It does not replace disk storage. Turn it on in `coreSet()` with `backend: 'stream'`.

## Ids you will see

| Id | Who owns it | Meaning |
| --- | --- | --- |
| `runId` | you | One prompt turn; use it to cancel |
| `sessionId` | you | Your session record |
| `acpSessionId` | the agent | The agent’s own session id |

ACP `session/new` receives this runtime’s MCP server once HTTP is listening (`http://127.0.0.1:<port>/mcp`). [Product director](../product-director/runtime.md) prompt sessions use those tools so they can report completed work.
