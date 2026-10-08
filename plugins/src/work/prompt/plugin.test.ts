import { describe, expect, it } from 'vitest';
import { createUiSlots } from '@buildautomaton/ui-runtime';
import { appUiPlugin } from './plugin.js';

describe('appUiPlugin', () => {
  it('puts the app in the main panel', () => {
    const slots = createUiSlots([appUiPlugin()]);
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual(['main:app']);
  });
});
