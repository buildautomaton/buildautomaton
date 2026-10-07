import type { PublishListingInput } from '../../types/listing.js';

export function marketplacePluginSeed(): PublishListingInput {
  return {
    kind: 'plugin',
    slug: 'marketplace',
    name: 'Marketplace',
    summary: 'Catalog plugins and app compositions with markdown, artifacts, source, and semantic search.',
    author: 'BuildAutomaton',
    description: `# Marketplace plugin

Stores listings for **plugins** and **apps**. Each listing keeps a markdown description (a director-style artifact), more artifacts, and the source tree.

Find listings with a semantic phrase over MCP (\`search_marketplace\`) or \`GET /api/marketplace?q=\`.
`,
    artifacts: [
      {
        kind: 'summary',
        title: 'Summary',
        files: [{ path: 'summary.md', content: 'SQL catalog with hashed embeddings so a prompt can rank plugins and apps.' }],
      },
      {
        kind: 'api',
        title: 'API',
        files: [{ path: 'api.md', content: 'GET/POST /api/marketplace, GET/PATCH/DELETE /api/marketplace/:id, GET .../source.' }],
      },
      {
        kind: 'dataModel',
        title: 'Data model',
        files: [{ path: 'data-model.md', content: 'Listing, artifacts (description + director kinds), source files, embedding vector.' }],
      },
    ],
    source: [
      { path: 'src/marketplace-set.ts', content: 'export function marketplaceSet() { return [marketplacePlugin(), marketplaceToolsPlugin()]; }' },
    ],
  };
}

export function marketplaceAppSeed(): PublishListingInput {
  return {
    kind: 'app',
    slug: 'marketplace-app',
    name: 'Marketplace app',
    summary: 'Browse and search the catalog in main. Director stays in the sidebar.',
    author: 'BuildAutomaton',
    plugins: ['marketplace', 'product-director'],
    description: `# Marketplace app

Composition of the marketplace catalog and product director. Publish a plugin with director artifacts, then find it later by a semantic phrase.
`,
    artifacts: [
      {
        kind: 'summary',
        title: 'Summary',
        files: [{ path: 'summary.md', content: 'Main screen catalog plus sidebar review of publish work.' }],
      },
    ],
    source: [{ path: 'compose.ts', content: 'createRuntime({ plugins: [...coreSet(), ...marketplaceSet(), ...productDirectorSet()] })' }],
  };
}
