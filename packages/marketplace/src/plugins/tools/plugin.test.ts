import { describe, expect, it } from 'vitest';
import { applyPlugins, sqlStorePlugin } from '@buildautomaton/runtime';
import type { ToolContext } from '@buildautomaton/runtime';
import { marketplacePlugin } from '../runtime/plugin.js';
import { marketplaceToolsPlugin } from './plugin.js';
import { SEARCH_MARKETPLACE } from './names.js';

describe('marketplace tools', () => {
  it('searches listings over the extras.marketplace backend', async () => {
    const slots = applyPlugins(
      [sqlStorePlugin({ options: { file: ':memory:' } }), marketplacePlugin(), marketplaceToolsPlugin()],
      { cwd: '/', log: () => {} },
    );
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
