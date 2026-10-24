import type { PluginRuntimeContext } from '@buildautomaton/runtime';
import type { TransportEndpoint } from '@plugins/transport/transport/endpoints.js';
import type { DoSqlBackend } from './stores/cloudflare-sql/do-storage.js';
import type { D1DatabaseLike } from './stores/cloudflare-sql/d1-types.js';
import type { DoSqlNamespace } from './stores/cloudflare-sql/do-rpc.js';
import type { R2BucketLike } from './stores/r2/types.js';
import type { SecurityOptions } from './security/plugin.js';
import type { DataStoreOptions } from './data-store/plugin.js';
import type { WorkflowOptions } from './workflows/plugin.js';
import type { WidgetOptions } from './widgets/plugin.js';
import type { ExternalMcpOptions } from './external-mcp/plugin.js';

export type WorkerHostOptions = {
  storage?: Record<string, DoSqlBackend>;
  d1?: Record<string, D1DatabaseLike>;
  doOpeners?: Record<string, DoSqlNamespace>;
  r2?: R2BucketLike;
  r2Prefix?: string;
  httpEndpoints?: TransportEndpoint[];
  runtime?: PluginRuntimeContext;
  security?: SecurityOptions;
  dataStore?: DataStoreOptions;
  workflows?: WorkflowOptions;
  widgets?: WidgetOptions;
  externalMcp?: ExternalMcpOptions;
};

export { workerHostPlugins } from './worker-host-plugins.js';
