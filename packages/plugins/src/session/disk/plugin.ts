import type { SessionPlugin } from '@plugins/session/session/plugin.js';
import type { SessionHooks } from '@plugins/session/session/hooks.js';
import type { SessionImplementation } from '@plugins/session/session/implementation.js';
import type { PluginInit } from '@buildautomaton/runtime';
import type { DiskSessionOptions } from '@plugins/session/session/options.js';
import type { StoreContext } from '@plugins/transport/http/types/contribution.js';
import type { FileStore } from '@plugins/stores/file-store/interface.js';
import type { SqlStore } from '@plugins/stores/sql-store/interface.js';
import { createDiskBackend } from './backend.js';
import { createSqlSessionBackend } from '@plugins/session/sql/backend.js';
import { composeSessionStores } from '@plugins/session/session/compose.js';
import { contributeSessionHttp } from '@plugins/session/session/http/contribute.js';
import { SESSION_MIGRATIONS } from '@plugins/session/sql/migrations.js';
import { DEFAULT_SQL_SCHEMA } from '@plugins/stores/sql-store/schema.js';
export function diskSessionPlugin(
  init: PluginInit<DiskSessionOptions, SessionHooks, Partial<SessionImplementation>> & {
    options: DiskSessionOptions;
  },
): SessionPlugin {
  return {
    name: 'session-disk',
    kind: 'session',
    options: { dir: init.options.dir, id: init.options.id ?? 'disk' },
    hooks: init.hooks,
    supports: { stores: ['file-store', 'sql-store'], transports: ['http'] },
    createFromStores: (stores) => createSessionFromStores(init.options.dir, stores, init.implementation),
    contributeHttp: contributeSessionHttp,
    sqlSchema: DEFAULT_SQL_SCHEMA,
    sqlMigrations: SESSION_MIGRATIONS,
    runtime: init.runtime,
  };
}

function createSessionFromStores(
  dir: string,
  stores: StoreContext,
  override?: Partial<SessionImplementation>,
): SessionImplementation {
  const disk = stores.fileStore ? createDiskBackend(dir, stores.fileStore as FileStore) : undefined;
  const sql = stores.sqlStore ? createSqlSessionBackend(stores.sqlStore as SqlStore) : undefined;
  return { ...composeSessionStores(disk, sql), ...override };
}
