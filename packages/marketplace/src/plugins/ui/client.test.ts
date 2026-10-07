import { describe, expect, it } from 'vitest';
import { asListingSummaries } from './client.js';

describe('asListingSummaries', () => {
  it('accepts a list or an items wrapper', () => {
    expect(asListingSummaries([{ id: 'a' }])).toEqual([{ id: 'a' }]);
    expect(asListingSummaries({ items: [{ id: 'b' }] })).toEqual([{ id: 'b' }]);
  });

  it('rejects a non-list body', () => {
    expect(() => asListingSummaries({})).toThrow(/did not return a list/);
  });
});
