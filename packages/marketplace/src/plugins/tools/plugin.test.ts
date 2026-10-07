import { describe, expect, it } from 'vitest';
import { applyPlugins } from '@buildautomaton/plugins';
import type { ToolContext } from '@buildautomaton/plugins';
import { marketplacePlugin } from '../runtime/plugin.js';
import { testMarketplaceStorePlugins } from '../runtime/test-plugins.js';
import { marketplaceToolsPlugin } from './plugin.js';
import { SEARCH_MARKETPLACE } from './names.js';

describe('marketplace tools', () => {
  it('searches listings over the extras.marketplace backend', async () => {
    const slots = applyPlugins(
      [...testMarketplaceStorePlugins(), marketplacePlugin(), marketplaceToolsPlugin()],
      { cwd: '/', log: () => {} },
    );
    await Promise.all(slots.ready);
    const tools = marketplaceToolsPlugin();
    const result = await tools.implementation.callTool(
      SEARCH_MARKETPLACE,
      { query: 'inbox mail stored in sql' },
      { extras: slots.extras } as ToolContext,
    );
    expect(result.isError).toBeFalsy();
    expect(result.content[0]?.text).toMatch(/email/);
  });
});
