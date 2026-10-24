import { createUi, layoutPlugin, type UiPlugin } from '@buildautomaton/ui-runtime';
import { appUiPlugin } from './prompt/plugin.js';
import type { WorkClient } from './board/types.js';

export type BuildAutomatonUiOptions = {
  client?: WorkClient;
};

/** App surface only. The chat popup is not part of the product UI. */
export function buildautomatonUiSet(_options: BuildAutomatonUiOptions = {}): UiPlugin[] {
  return [appUiPlugin()];
}

export function createAppUi(options: BuildAutomatonUiOptions = {}) {
  return createUi({
    plugins: [layoutPlugin('app'), ...buildautomatonUiSet(options)],
  });
}
