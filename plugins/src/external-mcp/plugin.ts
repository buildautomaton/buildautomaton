import type { PluginInit } from '@buildautomaton/runtime';
import type { ExtensionPlugin } from '@plugins/extension-plugin.js';
import { normalizeMcpServers, type ExternalMcpServer } from './servers.js';

export type ExternalMcpOptions = { servers?: ExternalMcpServer[] };

export function externalMcpPlugin(init: PluginInit<ExternalMcpOptions> = {}): ExtensionPlugin {
  const servers = normalizeMcpServers(init.options?.servers);
  return {
    name: 'external-mcp',
    description: 'HTTP MCP servers the agent calls directly, beside the local meta-harness server.',
    targetRuntime: 'node',
    services: [{ id: 'external-mcp' }],
    options: { servers },
    createFromStores: () => ({ servers }),
    runtime: init.runtime,
  };
}
