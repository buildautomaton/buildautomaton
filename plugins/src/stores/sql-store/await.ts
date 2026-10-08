import type { AnySqlStore } from './any-store.js';
import type { SqlBind } from './interface.js';

export async function sqlExec(sql: AnySqlStore, query: string): Promise<void> {
  await Promise.resolve(sql.exec(query));
}

export async function sqlRun(sql: AnySqlStore, query: string, params?: SqlBind[]): Promise<void> {
  await Promise.resolve(sql.run(query, params));
}

export async function sqlGet(
  sql: AnySqlStore,
  query: string,
  params?: SqlBind[],
): Promise<Record<string, unknown> | undefined> {
  return await Promise.resolve(sql.get(query, params));
}

export async function sqlAll(
  sql: AnySqlStore,
  query: string,
  params?: SqlBind[],
): Promise<Record<string, unknown>[]> {
  return await Promise.resolve(sql.all(query, params));
}
