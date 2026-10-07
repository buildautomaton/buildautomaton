import { describe, expect, it } from 'vitest';
import { applyPlugins } from '@buildautomaton/runtime';
import { asHost } from '@plugins/host-slots.js';
import '@plugins/register-services.js';
import { minionToolsPlugin } from '@plugins/tools/minion/plugin.js';
import type { ToolsImplementation } from '@plugins/tools/tools/implementation.js';
import type { ToolsPlugin } from '@plugins/tools/tools/plugin.js';

const pingTools: ToolsImplementation = {
  listTools: () => [{ name: 'ping', description: 'Health check', inputSchema: { type: 'object' } }],
  callTool: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
};
const ping: ToolsPlugin = {
  name: 'tools-ping',
  services: [{ id: 'tools', implementation: pingTools }],
  implementation: pingTools,
};

describe('applyPlugins tools', () => {
  it('registers minion tools as one of several tools plugins', () => {
    const slots = applyPlugins([minionToolsPlugin(), ping], { log: () => {}, cwd: '/tmp' });
    expect(asHost(slots).tools).toHaveLength(2);
  });
});
