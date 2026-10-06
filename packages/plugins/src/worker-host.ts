import type { PluginRuntimeContext } from '@buildautomaton/runtime';
import type { TransportEndpoint } from '@plugins/transport/transport/endpoints.js';
import type { DoSqlBackend } from './stores/cloudflare-sql/do-storage.js';
import type { D1DatabaseLike } from './stores/cloudflare-sql/d1-types.js';
import type { DoSqlNamespace } from './stores/cloudflare-sql/do-rpc.js';
import type { R2BucketLike } from './stores/r2/types.js';

export type WorkerHostOptions = {
  storage?: Record<string, DoSqlBackend>;
  d1?: Record<string, D1DatabaseLike>;
  doOpeners?: Record<string, DoSqlNamespace>;
  r2?: R2BucketLike;
  r2Prefix?: string;
  httpEndpoints?: TransportEndpoint[];
  runtime?: PluginRuntimeContext;
};

export { workerHostPlugins } from './worker-host-plugins.js';
