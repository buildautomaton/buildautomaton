import type { AnyFileStore } from '@plugins/stores/file-store/any-store.js';
import type { R2BucketLike } from './types.js';
import { r2ChildNames, r2Key } from './keys.js';

export function createR2FileStore(bucket: R2BucketLike, prefix = ''): AnyFileStore {
  const keyOf = (path: string) => r2Key(prefix, path);
  return {
    backend: 'r2',
    async read(path) {
      const object = await bucket.get(keyOf(path));
      return object ? object.text() : null;
    },
    async write(path, content) {
      await bucket.put(keyOf(path), content);
    },
    async append(path, content) {
      const current = (await bucket.get(keyOf(path)))?.text() ?? Promise.resolve('');
      await bucket.put(keyOf(path), `${await current}${content}`);
    },
    async remove(path) {
      await bucket.delete(keyOf(path));
    },
    async mkdir() {},
    async list(dir) {
      const listed = await bucket.list({ prefix: `${keyOf(dir)}/` });
      return r2ChildNames(listed.objects.map((object) => object.key), keyOf(dir));
    },
    async exists(path) {
      return (await bucket.get(keyOf(path))) !== null;
    },
  };
}
