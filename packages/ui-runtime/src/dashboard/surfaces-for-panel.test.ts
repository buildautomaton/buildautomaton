import { describe, expect, it } from 'vitest';
import type { UiSurface } from '../core/plugin.js';
import { surfacesForPanel } from './surfaces-for-panel.js';

const surfaces = [
  { id: 'marketplace-catalog', title: 'Marketplace', panel: 'main', component: () => null },
  { id: 'email-inbox', title: 'Mail', panel: 'main', component: () => null },
] as UiSurface[];

describe('surfacesForPanel', () => {
  it('returns the selected main surface', () => {
    expect(surfacesForPanel(surfaces, 'email-inbox').map((s) => s.id)).toEqual(['email-inbox']);
  });

  it('defaults to the first surface', () => {
    expect(surfacesForPanel(surfaces, null).map((s) => s.id)).toEqual(['marketplace-catalog']);
  });
});
