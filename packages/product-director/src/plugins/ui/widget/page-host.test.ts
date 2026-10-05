import { describe, expect, it } from 'vitest';
import { pageHostWarning } from './page-host.js';

describe('pageHostWarning', () => {
  it('accepts a local dev server and flags a public page', () => {
    expect(pageHostWarning('http://127.0.0.1:5173/')).toBeNull();
    expect(pageHostWarning('https://example.com')).toMatch(/dev server/);
    expect(pageHostWarning(null)).toMatch(/dev server/);
  });
});
