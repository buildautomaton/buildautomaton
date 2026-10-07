import { describe, expect, it } from 'vitest';
import { createMarketplaceBackend } from './backend.js';
import { testMarketplaceStores } from './test-stores.js';

function market() {
  return createMarketplaceBackend(testMarketplaceStores());
}

describe('marketplace SQL backend', () => {
  it('seeds plugins and apps and finds them semantically', async () => {
    const catalog = market();
    expect((await catalog.list('plugin')).length).toBeGreaterThan(0);
    expect((await catalog.list('app')).length).toBeGreaterThan(0);
    const hits = await catalog.search('hashed embeddings catalog stored source files');
    expect(hits[0]?.slug).toBe('marketplace');
    const listing = await catalog.get('email');
    expect(listing?.artifacts.some((artifact) => artifact.kind === 'description')).toBe(true);
    expect(listing?.source.length).toBeGreaterThan(0);
  });

  it('publishes a composition with director artifacts', async () => {
    const catalog = market();
    const saved = await catalog.publish({
      kind: 'app',
      slug: 'notes-app',
      name: 'Notes',
      description: '# Notes\n\nCompose notes plugins.',
      plugins: ['notes', 'product-director'],
      artifacts: [{ kind: 'summary', title: 'Summary', files: [{ path: 'summary.md', content: 'Notes app.' }] }],
      source: [{ path: 'compose.ts', content: 'notesSet()' }],
    });
    expect((await catalog.get(saved.slug))?.plugins).toEqual(['notes', 'product-director']);
    expect(await catalog.source(saved.slug, 'compose.ts')).toMatchObject({ path: 'compose.ts' });
  });
});
