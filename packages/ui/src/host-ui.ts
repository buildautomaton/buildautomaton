import { createUi, layoutPlugin } from '@buildautomaton/ui-runtime';
import { productDirectorUiSet } from '@buildautomaton/product-director/ui';
import { marketplaceUiSet } from '@buildautomaton/marketplace/ui';
import { appNavPlugin } from './app-nav.js';

export function createHostUi() {
  return createUi({
    plugins: [layoutPlugin('sidebar'), appNavPlugin(), ...marketplaceUiSet(), ...productDirectorUiSet()],
  });
}
