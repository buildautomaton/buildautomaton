import { describe, expect, it } from 'vitest';
import { fetchTransportPlugin } from './fetch-transport.js';

describe('fetchTransportPlugin', () => {
  it('starts without listening and fires onListening', async () => {
    const plugin = fetchTransportPlugin();
    expect(plugin.options.listen).toBe(false);
    let heard = false;
    await plugin.implementation.start({
      cwd: '/',
      listTools: async () => [],
      callTool: async () => ({ content: [] }),
      onListening: () => {
        heard = true;
      },
    });
    expect(heard).toBe(true);
    await plugin.implementation.stop();
  });
});
