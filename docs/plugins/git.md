# Git

`gitPlugin` reports whether the working directory is inside a git repository, plus the repo root and current branch. `coreSet()` installs it. The chat widget reads `GET /api/git`.

```ts
import { gitPlugin } from '@buildautomaton/plugins';

gitPlugin({ runtime })
```

Lookups use two short git commands in parallel and a short cache, so opening the directory popup does not spawn git on every click.
