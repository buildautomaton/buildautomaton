import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { AppScreen } from './screen.js';

export function appUiPlugin(): UiPlugin {
  return {
    name: 'app',
    description: 'Blank BuildAutomaton prompt that morphs into the running app. Use as the main surface of a host.',
    targetRuntime: 'react',
    implementation: {
      surfaces: [{ id: 'app', title: 'App', panel: 'main', order: 0, component: AppScreen }],
    },
  };
}
