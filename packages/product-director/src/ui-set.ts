import { createUi, layoutPlugin, type UiPlugin } from '@buildautomaton/ui-runtime';
import { appUiPlugin } from './plugins/ui/app/plugin.js';
import { widgetUiPlugin } from './plugins/ui/widget/plugin.js';
import type { WorkClient } from './plugins/ui/work/types.js';

export type ProductDirectorUiOptions = {
  client?: WorkClient;
};

export function productDirectorUiSet(options: ProductDirectorUiOptions = {}): UiPlugin[] {
  return [widgetUiPlugin(options.client)];
}

export function createAppUi(options: ProductDirectorUiOptions = {}) {
  return createUi({
    plugins: [layoutPlugin('sidebar'), appUiPlugin(), ...productDirectorUiSet(options)],
  });
}
