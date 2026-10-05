import { describe, expect, it } from 'vitest';
import { applyUiPlugins } from '@buildautomaton/ui-runtime';
import { widgetUiPlugin } from './plugin.js';

describe('widgetUiPlugin', () => {
  it('puts the director in the sidebar', () => {
    const slots = applyUiPlugins([widgetUiPlugin()]);
    expect(slots.layout).toBe('sidebar');
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual(['sidebar:director-widget']);
  });
});
