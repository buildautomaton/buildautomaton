import { createUi, layoutPlugin, type UiPlugin } from '@buildautomaton/ui-runtime';
import { appUiPlugin } from './prompt/plugin.js';
import { widgetUiPlugin } from './widget/plugin.js';
import type { WorkClient } from './board/types.js';

export type BuildAutomatonUiOptions = {
  client?: WorkClient;
};

export function buildautomatonUiSet(options: BuildAutomatonUiOptions = {}): UiPlugin[] {
  return [appUiPlugin(), widgetUiPlugin(options.client)];
}

export function createAppUi(options: BuildAutomatonUiOptions = {}) {
  return createUi({
    plugins: [layoutPlugin('app'), ...buildautomatonUiSet(options)],
  });
}
