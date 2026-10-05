export type SqlStoreOptions = {
  /** Isolated database name. Locally a file; on Cloudflare, one Durable Object. Default: `work`. */
  schema?: string;
  /** SQLite file path. Default: `<cwd>/.harness/work.sqlite` or `.harness/sql/<schema>.sqlite`. */
  file?: string;
  id?: string;
};
