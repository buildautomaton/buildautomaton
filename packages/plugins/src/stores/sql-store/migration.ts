import type { AnySqlStore } from './any-store.js';

/** One named schema change, scoped to the plugin that injected it. */
export type SqlMigration = {
  name: string;
  migrate: (sql: AnySqlStore) => void | Promise<void>;
  alreadyApplied?: (sql: AnySqlStore) => boolean | Promise<boolean>;
  checkpoint?: boolean;
  replacesLegacyMigrations?: readonly string[];
};
