import type { SqlBackendKind } from './backend.js';
import type { SqlMigration } from './migration.js';

export type SqlBind = string | number | null;

/** SQL service contract. Concrete engines live in store plugins (sqlite, DO, D1). */
export type SqlStore = {
  backend?: SqlBackendKind;
  exec(sql: string): void;
  run(sql: string, params?: SqlBind[]): void;
  get(sql: string, params?: SqlBind[]): Record<string, unknown> | undefined;
  all(sql: string, params?: SqlBind[]): Record<string, unknown>[];
  transaction<T>(fn: () => T): T;
  migrate(scope: string, migrations: readonly SqlMigration[]): void;
};
