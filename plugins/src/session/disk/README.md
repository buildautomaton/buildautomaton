# disk sessions

**Target runtime:** node

Persist agent sessions as files under `.harness/sessions`, with an optional SQL overlay. Default for local-cli. The chat popup reads these files through `GET /api/sessions`.

Use stream or memory sessions if you do not want files.
