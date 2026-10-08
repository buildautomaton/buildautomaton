import { describe, expect, it } from 'vitest';
import { allowsBuildAutomatonOrigin } from './setup-origin.js';

describe('allowsBuildAutomatonOrigin', () => {
  it('allows the local app and blocks other sites', () => {
    expect(allowsBuildAutomatonOrigin(undefined, '127.0.0.1:3333')).toBe(true);
    expect(allowsBuildAutomatonOrigin('http://127.0.0.1:3333', '127.0.0.1:3333')).toBe(true);
    expect(allowsBuildAutomatonOrigin('http://localhost:5173', '127.0.0.1:3333')).toBe(true);
    expect(allowsBuildAutomatonOrigin('http://evil.example', '127.0.0.1:3333')).toBe(false);
  });
});
