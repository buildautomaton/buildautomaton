import { describe, expect, it } from 'vitest';
import { localDevAllowed } from './dev-host.js';

describe('localDevAllowed', () => {
  it('allows local dev hosts', () => {
    expect(localDevAllowed('localhost', null)).toBe(true);
    expect(localDevAllowed('127.0.0.1', null)).toBe(true);
    expect(localDevAllowed('::1', null)).toBe(true);
    expect(localDevAllowed('app.local', null)).toBe(true);
  });

  it('stays off public hosts unless forced', () => {
    expect(localDevAllowed('example.com', null)).toBe(false);
    expect(localDevAllowed('example.com', 'always')).toBe(true);
    expect(localDevAllowed('localhost', 'off')).toBe(false);
  });
});
