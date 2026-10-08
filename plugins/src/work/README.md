# work

Plugins that power the BuildAutomaton prompt, work queue, artifacts, and sidebar widget. This category is **work**, not the repo name.

| Plugin | Runtime | Use when |
| --- | --- | --- |
| [queue](./queue/) | node | Persist drafts, queued work, artifacts |
| [work-tools](./work-tools/) | node | Agent ask/tell/interview MCP loop |
| [coordinator](./coordinator/) | node | Start harness sessions for queued work |
| [artifacts](./artifacts/) | node | Typed review artifacts (summary, UI, API, …) |
| [prompt](./prompt/) | react | Blank prompt that morphs into the app |
| [sidebar](./sidebar/) | react | BuildAutomaton widget beside the app |
| [board](./board/) | react | Full-screen work columns |

`buildautomatonSet()` installs the node plugins. `buildautomatonUiSet()` installs prompt + sidebar.
