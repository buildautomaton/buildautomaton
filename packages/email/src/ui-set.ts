import { createUi, layoutPlugin } from '@buildautomaton/ui-runtime';
import { productDirectorUiSet } from '@buildautomaton/product-director/ui';
import { emailUiPlugin } from './plugins/ui/plugin.js';

export function emailUiSet() {
  return [emailUiPlugin()];
}

export function createEmailUi() {
  return createUi({
    plugins: [layoutPlugin('sidebar'), ...emailUiSet(), ...productDirectorUiSet()],
  });
}
