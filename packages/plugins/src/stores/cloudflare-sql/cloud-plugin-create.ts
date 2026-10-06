import type { SqlStorePlugin } from '@plugins/stores/sql-store/plugin.js';
import { DEFAULT_SQL_SCHEMA, sqlStorePluginName } from '@plugins/stores/sql-store/schema.js';
import { createD1SqlStore } from './d1-store.js';
import { createDoSqlStore } from './do-store.js';
import { createDoSqlOpener } from './do-rpc-opener.js';
import { type CloudSqlStorePluginInit } from './cloud-plugin.js';

function inferBackend(options: CloudSqlStorePluginInit['options']): 'd1' | 'do' {
  if (options?.backend === 'd1' || options?.d1) return 'd1';
  return 'do';
}

/** One Cloudflare SQL plugin. `options.backend` selects D1 vs Durable Object. */
export function cloudSqlStorePlugin(init: CloudSqlStorePluginInit = {}): SqlStorePlugin {
  const backend = init.options?.backend ?? inferBackend(init.options);
  const schema = init.options?.schema ?? DEFAULT_SQL_SCHEMA;
  const shared = {
    kind: 'sql-store' as const,
    options: { id: init.options?.id ?? schema, schema, backend },
    sqlMigrations: init.sqlMigrations,
    runtime: init.runtime,
    name: sqlStorePluginName(schema, backend === 'd1' ? 'store-sql-d1' : 'store-sql-do'),
  };
  if (backend === 'd1') {
    if (!init.options?.d1 && !init.implementation) {
      throw new Error('cloudSqlStorePlugin backend d1 requires options.d1 or implementation');
    }
    return {
      ...shared,
      implementation: (init.implementation ?? createD1SqlStore(init.options!.d1!)) as SqlStorePlugin['implementation'],
    };
  }
  if (init.opener || init.options?.namespace) {
    return { ...shared, opener: init.opener ?? createDoSqlOpener(init.options!.namespace!) };
  }
  if (!init.options?.storage && !init.implementation) {
    throw new Error('cloudSqlStorePlugin backend do requires options.storage, namespace, or implementation');
  }
  const base = init.options?.storage ? createDoSqlStore(init.options.storage) : undefined;
  return { ...shared, implementation: { ...base, ...init.implementation } as SqlStorePlugin['implementation'] };
}
