import { describe, expect, it } from 'vitest';
import { allowsBuildautomatonOrigin } from './setup-origin.js';

describe('allowsBuildautomatonOrigin', () => {
  it('allows the local app and blocks other sites', () => {
    expect(allowsBuildautomatonOrigin(undefined, '127.0.0.1:3333')).toBe(true);
    expect(allowsBuildautomatonOrigin('http://127.0.0.1:3333', '127.0.0.1:3333')).toBe(true);
    expect(allowsBuildautomatonOrigin('http://localhost:5173', '127.0.0.1:3333')).toBe(true);
    expect(allowsBuildautomatonOrigin('http://evil.example', '127.0.0.1:3333')).toBe(false);
  });
});
