import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from '@buildautomaton/runtime';
import { createMarketplaceBackend } from './backend.js';
import { MARKETPLACE_MIGRATIONS } from './migrations.js';

function market() {
  const sql = sqlStorePlugin({ options: { file: ':memory:' } }).implementation;
  sql.migrate('marketplace-sql', MARKETPLACE_MIGRATIONS);
  return createMarketplaceBackend(sql);
}

describe('marketplace SQL backend', () => {
  it('seeds plugins and apps and finds them semantically', () => {
    const catalog = market();
    expect(catalog.list('plugin').length).toBeGreaterThan(0);
    expect(catalog.list('app').length).toBeGreaterThan(0);
    const hits = catalog.search('hashed embeddings catalog stored source files');
    expect(hits[0]?.slug).toBe('marketplace');
    const listing = catalog.get('email');
    expect(listing?.artifacts.some((artifact) => artifact.kind === 'description')).toBe(true);
    expect(listing?.source.length).toBeGreaterThan(0);
  });

  it('publishes a composition with director artifacts', () => {
    const catalog = market();
    const saved = catalog.publish({
      kind: 'app',
      slug: 'notes-app',
      name: 'Notes',
      description: '# Notes\n\nCompose notes plugins.',
      plugins: ['notes', 'product-director'],
      artifacts: [{ kind: 'summary', title: 'Summary', files: [{ path: 'summary.md', content: 'Notes app.' }] }],
      source: [{ path: 'compose.ts', content: 'notesSet()' }],
    });
    expect(catalog.get(saved.slug)?.plugins).toEqual(['notes', 'product-director']);
    expect(catalog.source(saved.slug, 'compose.ts')).toMatchObject({ path: 'compose.ts' });
  });
});
