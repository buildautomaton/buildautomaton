import type { PluginInit } from '@buildautomaton/runtime';
import type { ExtensionPlugin } from '@plugins/extension-plugin.js';
import { requireSqlStore } from '@plugins/stores/sql-store/pick.js';
import { DEFAULT_SQL_SCHEMA } from '@plugins/stores/sql-store/schema.js';
import type { StoreContext } from '@plugins/transport/http/types/contribution.js';
import type { ToolsImplementation } from '@plugins/tools/tools/implementation.js';
import { gateFrom } from './gate.js';
import { DATA_STORE_MIGRATIONS } from './migrations.js';
import { createDataStore } from './open.js';
import { callDataStoreTool, DATA_STORE_TOOLS } from './tools.js';
import type { MutationSource } from './mutate.js';

export type DataStoreOptions = {
  workspaceId?: string;
  mutations?: MutationSource[];
};

const tools: ToolsImplementation = {
  listTools: () => DATA_STORE_TOOLS,
  callTool: (name, args, ctx) => callDataStoreTool(name, args, ctx),
};

export function dataStorePlugin(init: PluginInit<DataStoreOptions> = {}): ExtensionPlugin {
  const workspaceId = init.options?.workspaceId ?? 'local';
  const mutations = init.options?.mutations ?? [];
  return {
    name: 'data-store',
    description: 'Workspace collections and named mutations. Asks the security plugin before it reads or writes.',
    targetRuntime: 'node',
    services: [{ id: 'data-store' }, { id: 'tools', implementation: tools }],
    options: { workspaceId, mutations },
    sqlSchema: DEFAULT_SQL_SCHEMA,
    sqlMigrations: DATA_STORE_MIGRATIONS,
    createFromStores: (stores: StoreContext) =>
      createDataStore(
        requireSqlStore(stores, DEFAULT_SQL_SCHEMA, 'data store plugin'),
        { workspaceId, mutations },
        () => gateFrom(stores.extras),
      ),
    runtime: init.runtime,
  };
}
