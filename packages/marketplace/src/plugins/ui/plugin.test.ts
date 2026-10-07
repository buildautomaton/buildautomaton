import { describe, expect, it } from 'vitest';
import { applyUiPlugins } from '@buildautomaton/ui-runtime';
import { createMarketplaceUi, marketplaceUiSet } from '../../ui-set.js';
import { marketplaceUiPlugin } from './plugin.js';

describe('marketplace UI', () => {
  it('puts the catalog in main', () => {
    const slots = applyUiPlugins(marketplaceUiSet());
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual(['main:marketplace-catalog']);
    expect(marketplaceUiPlugin().name).toBe('marketplace');
  });

  it('composes catalog and director', () => {
    const { slots } = createMarketplaceUi();
    expect(slots.layout).toBe('sidebar');
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual([
      'main:marketplace-catalog',
      'sidebar:director-widget',
    ]);
  });
});
