# R2 file store

**Target runtime:** node (Workers)

File store backed by one R2 bucket. Use on Workers when files should not live on a local disk.

Requires `options.bucket`. Pair with Cloudflare SQL for structured data.
