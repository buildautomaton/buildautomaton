# Git

`gitPlugin` reports whether the working directory is inside a git repository, plus the repo root and current branch. `coreSet()` installs it. Other plugins read `GET /api/git`.

```ts
import { gitPlugin } from '@buildautomaton/plugins';

gitPlugin({ runtime })
```

Lookups use two short git commands in parallel and a short cache, so repeated reads do not spawn git on every call.
