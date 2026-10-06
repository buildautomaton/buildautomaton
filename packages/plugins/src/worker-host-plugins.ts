import type { RuntimePlugin } from '@buildautomaton/runtime';
import { cloudSqlStorePlugin } from './stores/cloudflare-sql/cloud-plugin.js';
import { r2FileStorePlugin } from './stores/r2/plugin.js';
import { sqlSessionPlugin } from './session/sql/plugin.js';
import { memorySessionPlugin } from './session/memory/plugin.js';
import { fetchTransportPlugin } from './transport/http/fetch-transport.js';
import { acpPlugin } from './harnesses/acp/plugin.js';
import type { WorkerHostOptions } from './worker-host.js';

/** D1 and Durable Object SQL, optional R2 files, sessions, and Fetch HTTP. */
export function workerHostPlugins(init: WorkerHostOptions): RuntimePlugin[] {
  const runtime = init.runtime;
  const sql = [
    ...Object.entries(init.d1 ?? {}).map(([schema, d1]) =>
      cloudSqlStorePlugin({ options: { schema, backend: 'd1', d1 }, runtime }),
    ),
    ...Object.entries(init.storage ?? {}).map(([schema, storage]) =>
      cloudSqlStorePlugin({ options: { schema, backend: 'do', storage }, runtime }),
    ),
    ...Object.entries(init.doOpeners ?? {}).map(([schema, namespace]) =>
      cloudSqlStorePlugin({ options: { schema, backend: 'do', namespace }, runtime }),
    ),
  ];
  const files = init.r2
    ? [r2FileStorePlugin({ options: { bucket: init.r2, prefix: init.r2Prefix, backend: 'r2' }, runtime })]
    : [];
  const session = init.storage?.work
    ? [sqlSessionPlugin({ runtime })]
    : [memorySessionPlugin({ runtime })];
  return [
    ...sql,
    ...files,
    ...session,
    fetchTransportPlugin({ options: { endpoints: init.httpEndpoints }, runtime }),
    acpPlugin(),
  ];
}
