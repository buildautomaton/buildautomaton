import type { SqlBind } from '@/types/sql-store/implementation.js';

/** Minimal Cloudflare Durable Object SQL surface. */
export type DoSqlCursor = {
  toArray(): Record<string, unknown>[];
};

export type DoSqlExec = {
  exec(query: string, ...bindings: SqlBind[]): DoSqlCursor;
};

export type DoSqlBackend = {
  sql: DoSqlExec;
  transactionSync?<T>(fn: () => T): T;
};
