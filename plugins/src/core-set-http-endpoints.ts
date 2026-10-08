import type { CoreSetOptions } from './core-set.js';
import type { TransportEndpoint } from '@plugins/transport/transport/endpoints.js';
import { MCP_DEFAULT_PATH } from './transport/http/http-path.js';
import { buildautomatonHttpEndpoints } from './work/set.js';

export function coreHttpEndpoints(opts: CoreSetOptions): TransportEndpoint[] {
  const tools: TransportEndpoint = { kind: 'tools', path: opts.mcpPath ?? MCP_DEFAULT_PATH };
  const automaton = opts.buildautomaton === false ? [] : buildautomatonHttpEndpoints();
  return [tools, ...automaton, ...(opts.httpEndpoints ?? [])];
}
