# Product director: runtime plugins

These plugins run inside [`@buildautomaton/plugins`](../plugins/). `productDirectorSet()` installs all of them. They need the shared SQL store and HTTP server (not the file store). The same set works on a local host or a cloud host.

## Artifact plugins

Each artifact plugin teaches agents (and the tell tool) about one kind of review output. Add or remove a plugin and the tell tool grows or shrinks with it.

| Plugin | Kind | What it captures |
| --- | --- | --- |
| `summaryArtifactPlugin` | `summary` | Short plain-language blurbs of what changed by area |
| `changesOverviewArtifactPlugin` | `changesOverview` | A structured overview of the change set |
| `apiArtifactPlugin` | `api` | API surfaces that changed |
| `dataModelArtifactPlugin` | `dataModel` | Data model / schema changes |
| `uiArtifactPlugin` | `ui` | UI screens and flows |
| `algorithmArtifactPlugin` | `algorithm` | Non-trivial logic / algorithms |

## Work plugin

`sqliteWorkPlugin` (service id `work`) owns the queue: drafts, queued items, completed work, answers, and artifacts in SQLite. It mounts HTTP under `/api` and serves the [sidebar widget](./ui.md). `memoryWorkPlugin` is for tests and light embeds.

## Director tools

`workToolsPlugin` (service id `tools`) adds three tools beside the runtime’s minion tools:

| Tool | What it does |
| --- | --- |
| `ask_product_director_what_to_build_next` | Hand the agent the next queued item |
| `tell_product_director_what_was_built` | Save artifacts from the registered artifact plugins |
| `ask_product_director_interview_questions` | Ask follow-up questions about a draft |

The tell tool’s fields and instructions are built from the artifact plugins you registered.

## Prompt sessions

The sidebar composer and the app’s first prompt start a **new ACP session** per prompt. `coordinatorPlugin` binds on HTTP listen (it does not auto-start). Each session is attached to this runtime’s MCP server (`/mcp`) so it can call `tell_product_director_what_was_built` when the work is done. The dashboard shows an in-progress task, then the recorded artifacts — not the session transcript.

`GET /api/director` includes `coordinator`. `POST /api/director/session` with `{ prompt, project? }` creates in-progress work and starts the session.

## HTTP paths

Default mounts: `/api/work`, `/api/artifacts`, `/api/assets`, `/api/work/events`, `/api/director`, `/director`, `/director.js`.
