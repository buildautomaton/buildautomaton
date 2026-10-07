import type { PublishListingInput } from '../../types/listing.js';

export function emailPluginSeed(): PublishListingInput {
  return {
    kind: 'plugin',
    slug: 'email',
    name: 'Email',
    summary: 'Sample SQL inbox plugin. Not part of the host. Compose it from the marketplace.',
    author: 'BuildAutomaton',
    description: `# Email plugin

Sample runtime plugin. Stores mail in its own \`email\` SQL schema. Pair it with the email UI surface to put an inbox in \`main\`.

This is a sample you compose yourself. The host does not install it. Find it here, then add \`emailSet()\` and a store for the \`email\` schema.
`,
    artifacts: [
      {
        kind: 'summary',
        title: 'Summary',
        files: [{ path: 'summary.md', content: 'Adds an inbox table and HTTP for listing, creating, and updating mail.' }],
      },
      {
        kind: 'api',
        title: 'API',
        files: [{ path: 'api.md', content: 'GET/POST /api/emails and GET/PATCH/DELETE /api/emails/:id. Optional ?folder=inbox.' }],
      },
      {
        kind: 'dataModel',
        title: 'Data model',
        files: [{ path: 'data-model.md', content: 'Email: id, fromAddr, toAddr, subject, body, folder, read, createdAt.' }],
      },
    ],
    source: [
      { path: 'src/plugins/runtime/plugin.ts', content: "export function emailPlugin() { return { name: 'email-sql', services: [{ id: 'email' }] }; }" },
      { path: 'src/email-set.ts', content: 'export function emailSet() { return [emailPlugin()]; }' },
    ],
  };
}

export function emailAppSeed(): PublishListingInput {
  return {
    kind: 'app',
    slug: 'email-app',
    name: 'Email app',
    summary: 'Sample inbox app. Compose email + director yourself; it is not in the host.',
    author: 'BuildAutomaton',
    plugins: ['email', 'product-director'],
    description: `# Email app

Sample composition: email runtime + UI plugins, plus product director as sidebar chrome. Not part of the default host. Install the listing, then compose \`emailSet()\` on its own \`email\` schema.
`,
    artifacts: [
      {
        kind: 'summary',
        title: 'Summary',
        files: [{ path: 'summary.md', content: 'Composes email and product-director plugins into one local or cloud app.' }],
      },
    ],
    source: [{ path: 'compose.ts', content: 'createRuntime({ plugins: [...coreSet(), ...emailSet(), ...productDirectorSet()] })' }],
  };
}
