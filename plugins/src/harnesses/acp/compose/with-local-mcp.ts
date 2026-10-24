import type { ClientHostHooks } from '@plugins/harnesses/acp/engine/types.js';
import { localMcpServers, type AccessPort } from './local-mcp.js';

export function withLocalMcp(host: ClientHostHooks, access: AccessPort, extra: unknown[] = []): ClientHostHooks {
  const own = host.mcpServers;
  return {
    ...host,
    getAccessPort: host.getAccessPort ?? (() => access.port),
    mcpServers: (info) => {
      const local = own ? own(info) : localMcpServers(info.accessPort ?? access.port);
      return extra.length ? [...local, ...extra] : local;
    },
  };
}
