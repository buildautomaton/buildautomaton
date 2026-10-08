import { describe, expect, it } from 'vitest';
import { createUiSlots } from '@buildautomaton/ui-runtime';
import { widgetUiPlugin } from './plugin.js';

describe('widgetUiPlugin', () => {
  it('puts the buildautomaton in the sidebar', () => {
    const slots = createUiSlots([widgetUiPlugin()]);
    expect(slots.layout).toBe('sidebar');
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual(['sidebar:buildautomaton-widget']);
  });
});
