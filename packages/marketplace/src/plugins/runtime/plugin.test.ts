import { describe, expect, it } from 'vitest';
import { applyPlugins, sqlStorePlugin } from '@buildautomaton/runtime';
import type { MarketplaceImplementation } from '../../types/implementation.js';
import { marketplacePlugin } from './plugin.js';

describe('marketplacePlugin', () => {
  it('requires a sql-store', () => {
    expect(() => marketplacePlugin().createFromStores?.({} as never)).toThrow(/marketplace sql-store/);
  });

  it('migrates and seeds on the shared SQL store', () => {
    const slots = applyPlugins([sqlStorePlugin({ options: { file: ':memory:' } }), marketplacePlugin()], {
      cwd: '/',
      log: () => {},
    });
    const market = slots.extras.marketplace as MarketplaceImplementation;
    expect(market.list().length).toBeGreaterThan(0);
    expect(market.get('product-director')?.name).toBe('Product director');
  });
});
