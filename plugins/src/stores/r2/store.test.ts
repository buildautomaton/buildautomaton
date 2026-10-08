import { describe, expect, it } from 'vitest';
import { createR2FileStore } from './store.js';
import { r2FileStorePlugin } from './plugin.js';
import type { R2BucketLike } from './types.js';

function memoryR2(): R2BucketLike {
  const map = new Map<string, string>();
  return {
    async get(key) {
      const value = map.get(key);
      return value === undefined ? null : { text: async () => value };
    },
    async put(key, value) {
      map.set(key, value);
    },
    async delete(key) {
      map.delete(key);
    },
    async list({ prefix } = {}) {
      return {
        objects: [...map.keys()].filter((key) => !prefix || key.startsWith(prefix)).map((key) => ({ key })),
      };
    },
  };
}

describe('R2 file store', () => {
  it('reads and writes under a prefix', async () => {
    const store = createR2FileStore(memoryR2(), 'marketplace');
    expect(store.backend).toBe('r2');
    await store.write('email/1.0.0/source/index.ts', 'export {}');
    expect(await store.read('email/1.0.0/source/index.ts')).toBe('export {}');
    expect(await store.list('email/1.0.0/source')).toEqual(['index.ts']);
    expect(r2FileStorePlugin({ options: { bucket: memoryR2(), backend: 'r2' } }).options?.backend).toBe('r2');
  });
});
