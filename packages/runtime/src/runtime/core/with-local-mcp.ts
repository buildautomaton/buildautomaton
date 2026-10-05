import type { ClientHostHooks } from '@runtime/acp/engine/types.js';
import { localMcpServers, type AccessPort } from './local-mcp.js';

export function withLocalMcp(host: ClientHostHooks, access: AccessPort): ClientHostHooks {
  return {
    ...host,
    getAccessPort: host.getAccessPort ?? (() => access.port),
    mcpServers: host.mcpServers ?? ((info) => localMcpServers(info.accessPort ?? access.port)),
  };
}
