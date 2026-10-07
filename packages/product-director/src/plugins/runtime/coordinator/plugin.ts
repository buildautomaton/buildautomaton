import type { ExtensionPlugin, PluginInit } from '@buildautomaton/plugins';
import { createCoordinator } from './backend.js';

export function coordinatorPlugin(init: PluginInit = {}): ExtensionPlugin {
  return {
    name: 'director-coordinator',
    services: [{ id: 'coordinator' }],
    createFromStores: () => createCoordinator(),
    runtime: init.runtime,
  };
}
