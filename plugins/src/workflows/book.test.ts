import { describe, expect, it } from 'vitest';
import { createWorkflowBook } from './book.js';

describe('workflows', () => {
  it('returns the overview and one stage', () => {
    const book = createWorkflowBook([
      { id: 'discover', title: 'Discover', steps: 'Search, then store the list.' },
    ]);
    expect(book.get()).toContain('discover');
    expect(book.get('discover')).toContain('Search, then store the list.');
    expect(book.get('missing')).toBe('Unknown workflow: missing');
  });
});
