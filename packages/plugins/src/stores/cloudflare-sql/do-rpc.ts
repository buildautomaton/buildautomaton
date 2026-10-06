import type { SqlBind } from '@plugins/stores/sql-store/interface.js';
import type { DoSqlBackend } from './do-storage.js';

/** RPC methods a per-key Durable Object exposes so the worker can run SQL. */
export type DoSqlRpcStub = {
  sqlExec(sql: string): Promise<void>;
  sqlRun(sql: string, params?: SqlBind[]): Promise<void>;
  sqlAll(sql: string, params?: SqlBind[]): Promise<Record<string, unknown>[]>;
  sqlGet(sql: string, params?: SqlBind[]): Promise<Record<string, unknown> | undefined>;
};

export type DoSqlNamespace = {
  idFromName(name: string): unknown;
  get(id: unknown): DoSqlRpcStub;
};

export function isDoSqlNamespace(value: unknown): value is DoSqlNamespace {
  return Boolean(
    value && typeof value === 'object' && typeof (value as DoSqlNamespace).idFromName === 'function',
  );
}

export function createDoSqlRpc(backend: DoSqlBackend): DoSqlRpcStub {
  return {
    async sqlExec(sql) {
      backend.sql.exec(sql);
    },
    async sqlRun(sql, params: SqlBind[] = []) {
      backend.sql.exec(sql, ...params);
    },
    async sqlAll(sql, params: SqlBind[] = []) {
      return backend.sql.exec(sql, ...params).toArray();
    },
    async sqlGet(sql, params: SqlBind[] = []) {
      return backend.sql.exec(sql, ...params).toArray()[0];
    },
  };
}
