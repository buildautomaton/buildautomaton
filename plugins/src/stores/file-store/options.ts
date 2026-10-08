import type { FileStoreBackend } from './backend.js';

export type FileStoreOptions = {
  /** Root for relative paths. Absolute paths are used as-is. Default: cwd. */
  root?: string;
  id?: string;
  /** Storage engine. The Cloudflare file-store plugin uses this to store in R2. */
  backend?: FileStoreBackend;
};
