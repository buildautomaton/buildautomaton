import { describe, expect, it } from 'vitest';
import { applyPlugins, createPluginRegistry } from '@buildautomaton/plugins';
import type { MarketplaceImplementation } from '../../types/implementation.js';
import { marketplacePlugin } from './plugin.js';
import { testMarketplaceStorePlugins } from './test-plugins.js';

describe('marketplacePlugin', () => {
  it('requires listings, a plugin opener, and a file-store', () => {
    expect(() => marketplacePlugin().createFromStores?.({ extras: {}, plugins: createPluginRegistry() })).toThrow(
      /marketplace listings/,
    );
  });

  it('migrates and seeds on listings SQL, plugin DOs, and files', async () => {
    const slots = applyPlugins([...testMarketplaceStorePlugins(), marketplacePlugin()], {
      cwd: '/',
      log: () => {},
    });
    await Promise.all(slots.ready);
    const market = slots.extras.marketplace as MarketplaceImplementation;
    expect((await market.list()).length).toBeGreaterThan(0);
    expect((await market.get('product-director'))?.name).toBe('Product director');
  });
});
