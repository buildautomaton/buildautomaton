import { describe, expect, it } from 'vitest';
import { allowsDirectorOrigin } from './setup-origin.js';

describe('allowsDirectorOrigin', () => {
  it('allows the director iframe and blocks other sites', () => {
    expect(allowsDirectorOrigin(undefined, '127.0.0.1:3333')).toBe(true);
    expect(allowsDirectorOrigin('http://127.0.0.1:3333', '127.0.0.1:3333')).toBe(true);
    expect(allowsDirectorOrigin('http://evil.example', '127.0.0.1:3333')).toBe(false);
  });
});