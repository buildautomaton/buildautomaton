import type { SqlBackendKind } from './backend.js';
import type { SqlBind, SqlStore } from './interface.js';
import type { SqlMigration } from './migration.js';

/** SQL store whose methods may be sync (SQLite, in-DO) or async (D1, DO RPC). */
export type AnySqlStore = {
  backend?: SqlBackendKind;
  exec(sql: string): void | Promise<void>;
  run(sql: string, params?: SqlBind[]): void | Promise<void>;
  get(sql: string, params?: SqlBind[]): Record<string, unknown> | undefined | Promise<Record<string, unknown> | undefined>;
  all(sql: string, params?: SqlBind[]): Record<string, unknown>[] | Promise<Record<string, unknown>[]>;
  transaction<T>(fn: () => T | Promise<T>): T | Promise<T>;
  migrate(scope: string, migrations: readonly SqlMigration[]): void | Promise<void>;
};

export function isSqlStore(value: unknown): value is SqlStore {
  return Boolean(value && typeof value === 'object' && typeof (value as SqlStore).all === 'function');
}
