import { mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync, appendFileSync, unlinkSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import type { FileStore } from '@plugins/stores/file-store/interface.js';

function writeInto(full: string, write: () => void): void {
  mkdirSync(dirname(full), { recursive: true });
  write();
}

export function createNodeFileStore(root: string): FileStore {
  mkdirSync(root, { recursive: true });
  const resolve = (p: string) => (isAbsolute(p) ? p : join(root, p));
  return {
    backend: 'disk',
    read(path) {
      const full = resolve(path);
      if (!existsSync(full)) return null;
      return readFileSync(full, 'utf8');
    },
    write(path, content) {
      const full = resolve(path);
      writeInto(full, () => writeFileSync(full, content));
    },
    append(path, content) {
      const full = resolve(path);
      writeInto(full, () => appendFileSync(full, content));
    },
    remove(path) {
      const full = resolve(path);
      if (existsSync(full)) unlinkSync(full);
    },
    mkdir(path) {
      mkdirSync(resolve(path), { recursive: true });
    },
    list(dir) {
      const full = resolve(dir);
      return existsSync(full) ? readdirSync(full) : [];
    },
    exists(path) {
      return existsSync(resolve(path));
    },
  };
}
