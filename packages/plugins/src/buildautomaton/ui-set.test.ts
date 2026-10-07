import { describe, expect, it } from 'vitest';
import { createUiSlots } from '@buildautomaton/ui-runtime';
import { buildautomatonUiSet, createAppUi } from './ui-set.js';

describe('buildautomaton UI set', () => {
  it('contributes the app and the sidebar widget', () => {
    const slots = createUiSlots(buildautomatonUiSet());
    expect(slots.layout).toBe('sidebar');
    expect(slots.surfaces.map((surface) => `${surface.panel}:${surface.id}`)).toEqual([
      'main:app',
      'sidebar:buildautomaton-widget',
    ]);
  });

  it('composes that set into the app shell', () => {
    const { slots } = createAppUi();
    expect(slots.layout).toBe('sidebar');
    expect(slots.surfaces.map((surface) => `${surface.panel}:${surface.id}`)).toEqual([
      'main:app',
      'sidebar:buildautomaton-widget',
    ]);
  });
});
