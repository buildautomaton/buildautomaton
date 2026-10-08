import type { PluginRuntimeContext } from '@buildautomaton/runtime';
import type { SqlStorePlugin } from '@plugins/stores/sql-store/plugin.js';
import type { DoSqlBackend } from './do-storage.js';
import { doSqlStorePlugin } from './do-plugin.js';

/** One Durable Object SQL store per schema. */
export function doSqlStorePlugins(
  storages: Record<string, DoSqlBackend>,
  runtime?: PluginRuntimeContext,
): SqlStorePlugin[] {
  return Object.entries(storages).map(([schema, storage]) =>
    doSqlStorePlugin({ options: { schema, storage }, runtime }),
  );
}
