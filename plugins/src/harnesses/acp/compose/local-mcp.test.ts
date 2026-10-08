import { describe, expect, it } from 'vitest';
import { localMcpServers } from './local-mcp.js';

describe('localMcpServers', () => {
  it('is empty until HTTP is listening', () => {
    expect(localMcpServers(null)).toEqual([]);
  });

  it('points ACP sessions at the runtime MCP HTTP server', () => {
    expect(localMcpServers(3333)).toEqual([
      { type: 'http', name: 'meta-harness', url: 'http://127.0.0.1:3333/mcp', headers: [] },
    ]);
  });
});
