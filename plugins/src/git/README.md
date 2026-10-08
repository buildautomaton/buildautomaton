# git

**Target runtime:** node

Working directory git context: whether `cwd` is inside a repository, the repo root, and the current branch. `coreSet()` installs this plugin. It serves `GET /api/git`.

Lookups run two short git commands in parallel and stay cached for a few seconds, so a popup can open without spawning git again.
