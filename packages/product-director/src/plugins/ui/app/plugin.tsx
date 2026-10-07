import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { AppScreen } from './screen.js';

export function appUiPlugin(): UiPlugin {
  return {
    name: 'app',
    implementation: {
      surfaces: [{ id: 'app', title: 'App', panel: 'main', order: 0, component: AppScreen }],
    },
  };
}
