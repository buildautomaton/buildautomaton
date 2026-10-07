import { createUi, layoutPlugin } from '@buildautomaton/ui-runtime';
import { productDirectorUiSet } from '@buildautomaton/product-director/ui';
import { marketplaceUiPlugin } from './plugins/ui/plugin.js';

export function marketplaceUiSet() {
  return [marketplaceUiPlugin()];
}

export function createMarketplaceUi() {
  return createUi({
    plugins: [layoutPlugin('sidebar'), ...marketplaceUiSet(), ...productDirectorUiSet()],
  });
}
