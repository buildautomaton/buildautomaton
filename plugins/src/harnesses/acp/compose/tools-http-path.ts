import type { TransportEndpoint } from '@plugins/transport/transport/endpoints.js';
import { MCP_DEFAULT_PATH } from '@buildautomaton/runtime';

export function toolsHttpPath(endpoints: readonly TransportEndpoint[] = []): string {
  return endpoints.find((item) => item.kind === 'tools')?.path ?? MCP_DEFAULT_PATH;
}
