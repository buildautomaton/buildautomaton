import type { SqlBind } from '@plugins/stores/sql-store/interface.js';
export type D1PreparedLike = {
  bind(...params: SqlBind[]): D1PreparedLike;
  all(): Promise<{ results?: Record<string, unknown>[] }>;
  first(): Promise<Record<string, unknown> | null>;
  run(): Promise<unknown>;
};

/** Minimal D1 surface so the runtime does not depend on workers-types. */
export type D1DatabaseLike = {
  prepare(query: string): D1PreparedLike;
  exec(query: string): Promise<unknown>;
};

export function isD1Database(value: unknown): value is D1DatabaseLike {
  return Boolean(value && typeof value === 'object' && typeof (value as D1DatabaseLike).prepare === 'function');
}
