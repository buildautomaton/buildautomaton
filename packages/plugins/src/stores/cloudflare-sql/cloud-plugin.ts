import type { SqlStorePluginInit } from '@plugins/stores/sql-store/plugin.js';
import type { SqlStoreOptions } from '@plugins/stores/sql-store/options.js';
import type { DoSqlBackend } from './do-storage.js';
import type { D1DatabaseLike } from './d1-types.js';
import type { DoSqlNamespace } from './do-rpc.js';

export type CloudSqlStoreOptions = SqlStoreOptions & {
  d1?: D1DatabaseLike;
  storage?: DoSqlBackend;
  namespace?: DoSqlNamespace;
};

export type CloudSqlStorePluginInit = Omit<SqlStorePluginInit, 'options'> & {
  options?: CloudSqlStoreOptions;
};

export { cloudSqlStorePlugin } from './cloud-plugin-create.js';
