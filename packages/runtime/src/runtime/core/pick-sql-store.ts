import type { SqlStore } from '@/types/sql-store/implementation.js';
import type { StoreContext } from '@/types/http/contribution.js';
import { DEFAULT_SQL_SCHEMA } from '@/types/sql-store/schema.js';

export function pickSqlStore(stores: StoreContext, schema = DEFAULT_SQL_SCHEMA): SqlStore | undefined {
  const named = stores.sqlStores?.[schema];
  if (named) return named;
  const names = Object.keys(stores.sqlStores ?? {});
  if (names.length <= 1) return stores.sqlStore;
  return undefined;
}

export function requireSqlStore(stores: StoreContext, schema: string, label: string): SqlStore {
  const sql = pickSqlStore(stores, schema);
  if (!sql) throw new Error(`${label} requires a ${schema} sql-store`);
  return sql;
}
