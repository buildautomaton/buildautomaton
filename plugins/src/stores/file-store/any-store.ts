import type { FileStoreBackend } from './backend.js';
import type { FileStore } from './interface.js';

/** File store whose methods may be sync (disk) or async (R2). */
export type AnyFileStore = {
  backend?: FileStoreBackend;
  read(path: string): string | null | Promise<string | null>;
  write(path: string, content: string): void | Promise<void>;
  append(path: string, content: string): void | Promise<void>;
  remove(path: string): void | Promise<void>;
  mkdir(path: string): void | Promise<void>;
  list(dir: string): string[] | Promise<string[]>;
  exists(path: string): boolean | Promise<boolean>;
};

export function isFileStore(value: unknown): value is FileStore {
  return Boolean(value && typeof value === 'object' && typeof (value as FileStore).write === 'function');
}
