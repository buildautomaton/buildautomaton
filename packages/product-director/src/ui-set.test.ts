import { describe, expect, it } from 'vitest';
import { applyUiPlugins } from '@buildautomaton/ui-runtime';
import { createAppUi, productDirectorUiSet } from './ui-set.js';

describe('product director UI set', () => {
  it('is only the sidebar widget', () => {
    const slots = applyUiPlugins(productDirectorUiSet());
    expect(slots.layout).toBe('sidebar');
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual(['sidebar:director-widget']);
  });

  it('composes the app in main beside the widget', () => {
    const { slots } = createAppUi();
    expect(slots.layout).toBe('sidebar');
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual([
      'main:app',
      'sidebar:director-widget',
    ]);
  });
});
