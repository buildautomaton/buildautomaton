# Marketplace

The marketplace is an app: it catalogs **plugins** and **apps** (plugin compositions). Each listing stores a markdown description, [director](../product-director/) artifacts, and the source tree. Agents find listings with a semantic phrase over MCP.

## Runtime

`marketplaceSet()` installs a file store for the `marketplace` schema, plus `marketplacePlugin` (`kind: 'marketplace'`) and `marketplaceToolsPlugin` (`kind: 'tools'`). On Cloudflare, pass `marketplaceSet({ options: { sql: false } })` and `doSqlStorePlugin({ options: { schema: 'marketplace', storage } })` so the catalog is one Durable Object.

[Local CLI](../local-cli/) already composes these plugins, so `/api/marketplace` and the marketplace MCP tools are live when the runtime is up.

```ts
import { createRuntime, coreSet, appPlugin } from '@buildautomaton/runtime';
import { productDirectorSet, directorHttpEndpoints } from '@buildautomaton/product-director';
import { marketplaceSet, marketplaceHttpEndpoints } from '@buildautomaton/marketplace';

const runtime = { cwd, log: console.error };
await createRuntime({
  cwd,
  plugins: [
    ...coreSet({
      options: { cwd, httpEndpoints: [...directorHttpEndpoints(), ...marketplaceHttpEndpoints()] },
      runtime,
    }),
    ...productDirectorSet({ runtime }),
    ...marketplaceSet({ runtime }),
    appPlugin({ runtime }),
  ],
});
```

## What a listing holds

| Field | Role |
| --- | --- |
| `kind` | `plugin` or `app` |
| `description` | Markdown, stored as a director-style `description` artifact |
| `artifacts` | Same kinds the director already builds: summary, api, dataModel, ui, algorithm |
| `source` | Path and content for every stored file |
| `plugins` | For apps: the plugin slugs in the composition |

HTTP: `GET/POST /api/marketplace`, `GET/PATCH/DELETE /api/marketplace/:id`, `GET /api/marketplace/:id/source`. `GET /api/marketplace?q=` is semantic search.

## MCP tools

| Tool | What it does |
| --- | --- |
| `search_marketplace` | Rank listings for a prompt or semantic phrase |
| `get_marketplace_listing` | Details, markdown, and artifacts |
| `list_marketplace` | Browse without a query |
| `get_marketplace_source` | Stored source tree or one file |
| `publish_marketplace` | Store a plugin or app with artifacts and source |

Search uses a local hashed embedding over the name, summary, markdown, artifacts, and source. No network model is required.

## UI

```ts
import { createMarketplaceUi } from '@buildautomaton/marketplace/ui';

const { App } = createMarketplaceUi();
```

The [UI](../ui/) host also composes the catalog next to [email](./email.md). Nav switches the main screen. Director stays in the sidebar.
