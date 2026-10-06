import type { AnySqlStore } from './any-store.js';
import type { SqlStore } from './interface.js';
import type { SqlStoreOpener } from './opener.js';
import type { StoreContext } from '../../transport/http/types/contribution.js';
import { DEFAULT_SQL_SCHEMA } from './schema.js';

export function pickSqlStore(stores: StoreContext, schema = DEFAULT_SQL_SCHEMA): AnySqlStore | undefined {
  const named = stores.sqlStores?.[schema];
  if (named) return named;
  const names = Object.keys(stores.sqlStores ?? {});
  if (names.length <= 1) return stores.sqlStore;
  return undefined;
}

export function requireSqlStore(stores: StoreContext, schema: string, label: string): SqlStore {
  const sql = pickSqlStore(stores, schema);
  if (!sql) throw new Error(`${label} requires a ${schema} sql-store`);
  return sql as SqlStore;
}

export function requireAnySqlStore(stores: StoreContext, schema: string, label: string): AnySqlStore {
  const sql = pickSqlStore(stores, schema);
  if (!sql) throw new Error(`${label} requires a ${schema} sql-store`);
  return sql;
}

export function pickSqlOpener(stores: StoreContext, schema: string): SqlStoreOpener | undefined {
  return stores.sqlOpeners?.[schema];
}

export function requireSqlOpener(stores: StoreContext, schema: string, label: string): SqlStoreOpener {
  const opener = pickSqlOpener(stores, schema);
  if (!opener) throw new Error(`${label} requires a ${schema} sql-store opener`);
  return opener;
}
