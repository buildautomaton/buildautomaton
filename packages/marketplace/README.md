# @buildautomaton/marketplace

Catalog plugins and app compositions. Locally, `marketplaceSet()` uses file SQLite and a disk file store. On Cloudflare, `createMarketplaceHost()` uses the D1, Durable Object, and R2 store plugins.

`MarketplacePluginDO` (`@buildautomaton/marketplace/do`) is one Durable Object per published plugin. Packaging and deployment of the hosted catalog live in the buildautomaton repo.
