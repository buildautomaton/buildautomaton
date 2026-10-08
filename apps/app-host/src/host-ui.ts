import { createUi, layoutPlugin } from '@buildautomaton/ui-runtime';
import { buildautomatonUiSet } from '@buildautomaton/plugins/ui';
import { appNavPlugin } from './app-nav.js';

export function createHostUi() {
  return createUi({
    plugins: [layoutPlugin('sidebar'), appNavPlugin(), ...buildautomatonUiSet()],
  });
}
