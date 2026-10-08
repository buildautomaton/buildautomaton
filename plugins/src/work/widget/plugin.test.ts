import { describe, expect, it } from 'vitest';
import { createUiSlots } from '@buildautomaton/ui-runtime';
import { widgetUiPlugin } from './plugin.js';

describe('widgetUiPlugin', () => {
  it('floats over the app and does not add a sidebar', () => {
    const slots = createUiSlots([widgetUiPlugin()]);
    expect(slots.layout).toBe('app');
    expect(slots.surfaces).toEqual([]);
    expect(slots.providers.map((provider) => provider.id)).toEqual(['work']);
  });
});
