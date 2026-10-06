import { describe, expect, it } from 'vitest';
import { directorDevAllowed } from './dev-host.js';

describe('directorDevAllowed', () => {
  it('allows local dev hosts', () => {
    expect(directorDevAllowed('localhost', null)).toBe(true);
    expect(directorDevAllowed('127.0.0.1', null)).toBe(true);
    expect(directorDevAllowed('::1', null)).toBe(true);
    expect(directorDevAllowed('app.local', null)).toBe(true);
  });

  it('stays off public hosts unless forced', () => {
    expect(directorDevAllowed('example.com', null)).toBe(false);
    expect(directorDevAllowed('example.com', 'always')).toBe(true);
    expect(directorDevAllowed('localhost', 'off')).toBe(false);
  });
});
