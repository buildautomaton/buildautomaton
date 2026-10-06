import type { PluginInit, RuntimePlugin } from '@buildautomaton/runtime';
import { createCoordinator } from './backend.js';

export function coordinatorPlugin(init: PluginInit = {}): RuntimePlugin {
  return {
    name: 'director-coordinator',
    kind: 'coordinator',
    createFromStores: () => createCoordinator(),
    runtime: init.runtime,
  };
}
