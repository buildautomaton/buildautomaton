import { describe, expect, it } from 'vitest';
import { applyUiPlugins } from '@buildautomaton/ui-runtime';
import { appUiPlugin } from './plugin.js';

describe('appUiPlugin', () => {
  it('puts the app in the main panel', () => {
    const slots = applyUiPlugins([appUiPlugin()]);
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual(['main:app']);
  });
});
