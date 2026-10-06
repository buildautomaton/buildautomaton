import type { SqlStoreOpener } from '@plugins/stores/sql-store/opener.js';
import { createDoRpcSqlStore } from './do-rpc-store.js';
import type { DoSqlNamespace } from './do-rpc.js';

export function createDoSqlOpener(namespace: DoSqlNamespace): SqlStoreOpener {
  return {
    backend: 'do',
    open(key) {
      return createDoRpcSqlStore(namespace.get(namespace.idFromName(key)));
    },
  };
}
