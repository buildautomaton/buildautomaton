import type { LogFn, PluginRegistry } from '@buildautomaton/runtime';
import type { AgentHarness } from '@plugins/harnesses/acp/host/types.js';
import type { AnyFileStore } from '../../../stores/file-store/any-store.js';
import type { AnySqlStore } from '../../../stores/sql-store/any-store.js';
import type { SqlStoreOpener } from '../../../stores/sql-store/opener.js';
import type { SessionImplementation } from '../../../session/session/implementation.js';

export type StoreContext = {
  fileStore?: AnyFileStore;
  sqlStore?: AnySqlStore;
  sqlStores?: Record<string, AnySqlStore>;
  sqlOpeners?: Record<string, SqlStoreOpener>;
  extras: Record<string, unknown>;
  plugins: PluginRegistry;
};

export type HttpContributeContext = {
  cwd: string;
  log: LogFn;
  extras: Record<string, unknown>;
  pluginName: string;
  backend?: SessionImplementation;
  mount?: string;
  routes?: Record<string, string>;
  harnesses?: readonly AgentHarness[];
};
