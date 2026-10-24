import { describe, expect, it } from 'vitest';
import { createPluginSlots } from '@buildautomaton/runtime';
import '@plugins/register-services.js';
import { withLocalMcp } from '@plugins/harnesses/acp/compose/with-local-mcp.js';
import { externalMcpPlugin } from './plugin.js';
import { mcpServersFromExtras } from './servers.js';

describe('external MCP servers', () => {
  it('appends a declared HTTP server after the local runtime server', () => {
    const slots = createPluginSlots(
      [externalMcpPlugin({ options: { servers: [{ name: 'stripe', url: 'https://example.test/mcp' }] } })],
      { cwd: '/', log: () => {} },
    );
    const extra = mcpServersFromExtras(slots.extras);
    const hooks = withLocalMcp({}, { port: 3333 }, extra);
    expect(hooks.mcpServers?.({ accessPort: 3333 })).toEqual([
      { type: 'http', name: 'meta-harness', url: 'http://127.0.0.1:3333/mcp', headers: [] },
      { type: 'http', name: 'stripe', url: 'https://example.test/mcp', headers: [] },
    ]);
  });
});
