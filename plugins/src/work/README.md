# work

Plugins that power the BuildAutomaton prompt, work queue, and artifacts. This category is **work**, not the repo name. The chat popup is not part of the app UI.

| Plugin | Runtime | Use when |
| --- | --- | --- |
| [queue](./queue/) | node | Persist drafts, queued work, artifacts |
| [work-tools](./work-tools/) | node | Agent ask/tell/interview MCP loop |
| [coordinator](./coordinator/) | node | Start harness sessions for queued work |
| [artifacts](./artifacts/) | node | Typed review artifacts (summary, UI, API, …) |
| [prompt](./prompt/) | react | Blank prompt that morphs into the app |

`buildautomatonSet()` installs the node plugins. `buildautomatonUiSet()` installs the prompt. Security, the data store, workflows, widgets, and external MCP are separate plugins.
