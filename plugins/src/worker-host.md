# worker host

**Target runtime:** node (Workers)

Composition helper, not a single plugin. `workerHostPlugins()` installs Cloudflare SQL, optional R2, SQL or memory sessions, fetch HTTP, and ACP.

Use this instead of `coreSet()` when the host is a Cloudflare Worker. Local-cli should keep `coreSet()`.
