import type { PublishListingInput } from '../../types/listing.js';

export function directorPluginSeed(): PublishListingInput {
  return {
    kind: 'plugin',
    slug: 'product-director',
    name: 'Product director',
    summary: 'Work queue, review artifacts, and a sidebar widget for agents and humans.',
    author: 'BuildAutomaton',
    description: `# Product director

A dual plugin pack. Runtime plugins hold the queue and director artifacts. The UI plugin is a sidebar widget only.

Agents ask what to build, then tell what was built. Artifacts (summary, API, data model, UI, algorithm) are the review surface.
`,
    artifacts: [
      {
        kind: 'summary',
        title: 'Summary',
        files: [{ path: 'summary.md', content: 'Queue plus artifact kinds that agents submit after they ship work.' }],
      },
      {
        kind: 'api',
        title: 'API',
        files: [{ path: 'api.md', content: 'Work and artifact HTTP under /api/work and /api/artifacts. MCP ask/tell tools on /mcp.' }],
      },
      {
        kind: 'ui',
        title: 'UI',
        files: [{ path: 'ui.md', content: 'Sidebar widget: queue, review, and questions. Never a main screen.' }],
      },
    ],
    source: [
      { path: 'src/director-set.ts', content: 'export function productDirectorSet() { return [...artifactPlugins(), sqliteWorkPlugin(), workToolsPlugin()]; }' },
    ],
  };
}
