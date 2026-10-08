import type { FileStoreBackend } from './backend.js';

/** File service contract. Concrete engines live in store plugins (disk, R2). */
export type FileStore = {
  backend?: FileStoreBackend;
  read(path: string): string | null;
  write(path: string, content: string): void;
  append(path: string, content: string): void;
  remove(path: string): void;
  mkdir(path: string): void;
  list(dir: string): string[];
  exists(path: string): boolean;
};
