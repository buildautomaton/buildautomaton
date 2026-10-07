import type { WorkPlugin, WorkPluginInit } from '@plugins/buildautomaton/types/work/plugin.js';
import type { ArtifactKind, ArtifactPlugin } from '@plugins/buildautomaton/types/artifact/index.js';
import type { StoreContext } from '@plugins/buildautomaton/host.js';
import { DEFAULT_SQL_SCHEMA, requireSqlStore } from '@plugins/buildautomaton/host.js';
import { createSqliteWorkBackend } from './backend.js';
import { contributeWorkHttp } from '@plugins/buildautomaton/plugins/runtime/work/http/contribute.js';
import { WORK_MIGRATIONS } from './migrations.js';

export function sqliteWorkPlugin(init: WorkPluginInit = {}): WorkPlugin {
  const options = { id: init.options?.id ?? 'sqlite', file: init.options?.file };
  return {
    name: 'work-sqlite',
    services: [{ id: 'work', options, hooks: init.hooks }],
    options,
    hooks: init.hooks,
    supports: { stores: ['sql-store'], transports: ['http'] },
    sqlSchema: DEFAULT_SQL_SCHEMA,
    sqlMigrations: WORK_MIGRATIONS,
    createFromStores: (stores) => {
      const sql = requireSqlStore(stores, DEFAULT_SQL_SCHEMA, 'work plugin');
      const kinds = artifactKindsFrom(stores);
      stores.extras.artifacts = kinds;
      return {
        id: init.options?.id ?? 'sqlite',
        ...createSqliteWorkBackend(sql, kinds),
        ...init.implementation,
      };
    },
    contributeHttp: contributeWorkHttp,
    runtime: init.runtime,
  };
}

export function memoryWorkPlugin(init: WorkPluginInit = {}): WorkPlugin {
  return { ...sqliteWorkPlugin({ ...init, options: { ...init.options, id: init.options?.id ?? 'memory' } }), name: 'work-memory' };
}

function artifactKindsFrom(stores: StoreContext): ArtifactKind[] {
  return stores.plugins
    .byService('artifact')
    .map((plugin) => (plugin as ArtifactPlugin).artifact)
    .filter((artifact): artifact is ArtifactKind => Boolean(artifact));
}
