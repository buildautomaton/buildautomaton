import type { ExtensionPlugin, PluginInit } from '@buildautomaton/plugins';
import { createCoordinator } from './backend.js';

export function coordinatorPlugin(init: PluginInit = {}): ExtensionPlugin {
  return {
    name: 'director-coordinator',
    kind: 'coordinator',
    createFromStores: () => createCoordinator(),
    runtime: init.runtime,
  };
}
