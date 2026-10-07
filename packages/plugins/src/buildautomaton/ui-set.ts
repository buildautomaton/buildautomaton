import { createUi, layoutPlugin, type UiPlugin } from '@buildautomaton/ui-runtime';
import { appUiPlugin } from './plugins/ui/app/plugin.js';
import { widgetUiPlugin } from './plugins/ui/widget/plugin.js';
import type { WorkClient } from './plugins/ui/work/types.js';

export type BuildautomatonUiOptions = {
  client?: WorkClient;
};

export function buildautomatonUiSet(options: BuildautomatonUiOptions = {}): UiPlugin[] {
  return [appUiPlugin(), widgetUiPlugin(options.client)];
}

export function createAppUi(options: BuildautomatonUiOptions = {}) {
  return createUi({
    plugins: [layoutPlugin('sidebar'), ...buildautomatonUiSet(options)],
  });
}
