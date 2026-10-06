import { describe, expect, it } from 'vitest';
import { applyUiPlugins } from '@buildautomaton/ui-runtime';
import { createEmailUi, emailUiSet } from '../../ui-set.js';
import { emailUiPlugin } from './plugin.js';

describe('email UI', () => {
  it('puts the inbox in main', () => {
    const slots = applyUiPlugins(emailUiSet());
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual(['main:email-inbox']);
    expect(emailUiPlugin().kind).toBe('surface');
  });

  it('composes inbox and director', () => {
    const { slots } = createEmailUi();
    expect(slots.layout).toBe('sidebar');
    expect(slots.surfaces.map((s) => `${s.panel}:${s.id}`)).toEqual([
      'main:email-inbox',
      'sidebar:director-widget',
    ]);
  });
});
