import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createNodeFileStore } from './store.js';

describe('createNodeFileStore', () => {
  it('creates parent directories on write', () => {
    const root = mkdtempSync(path.join(tmpdir(), 'file-store-'));
    const store = createNodeFileStore(root);
    store.write('a/b/c.txt', 'hello');
    expect(readFileSync(path.join(root, 'a/b/c.txt'), 'utf8')).toBe('hello');
    expect(store.read('a/b/c.txt')).toBe('hello');
  });
});
