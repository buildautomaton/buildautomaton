import type { CoreSetOptions } from './core-set.js';
import type { TransportEndpoint } from '@plugins/transport/transport/endpoints.js';
import { MCP_DEFAULT_PATH } from './transport/http/http-path.js';

export function coreHttpEndpoints(opts: CoreSetOptions): TransportEndpoint[] {
  const tools: TransportEndpoint = { kind: 'tools', path: opts.mcpPath ?? MCP_DEFAULT_PATH };
  return [tools, ...(opts.httpEndpoints ?? [])];
}
