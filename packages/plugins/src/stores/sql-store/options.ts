import type { SqlBackendKind } from './backend.js';

export type SqlStoreOptions = {
  /** Isolated database name. Locally a file; on Cloudflare, one D1 database or Durable Object. Default: `work`. */
  schema?: string;
  /** SQLite file path. Default: `<cwd>/.harness/work.sqlite` or `.harness/sql/<schema>.sqlite`. */
  file?: string;
  id?: string;
  /** Storage engine. The Cloudflare SQL plugin uses this to store in D1 vs Durable Objects. */
  backend?: SqlBackendKind;
};
