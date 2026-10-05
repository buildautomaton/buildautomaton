import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { MarketplaceCatalog } from './catalog.js';

export function marketplaceUiPlugin(): UiPlugin {
  return {
    name: 'marketplace',
    kind: 'surface',
    implementation: {
      surfaces: [{ id: 'marketplace-catalog', title: 'Marketplace', panel: 'main', order: 0, component: MarketplaceCatalog }],
    },
  };
}
