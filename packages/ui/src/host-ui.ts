import { createUi, layoutPlugin } from '@buildautomaton/ui-runtime';
import { productDirectorUiSet } from '@buildautomaton/product-director/ui';
import { appNavPlugin } from './app-nav.js';

export function createHostUi() {
  return createUi({
    plugins: [layoutPlugin('sidebar'), appNavPlugin(), ...productDirectorUiSet()],
  });
}
