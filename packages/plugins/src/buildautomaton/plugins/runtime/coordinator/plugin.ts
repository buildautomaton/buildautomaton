import type { ExtensionPlugin, PluginInit } from '@plugins/buildautomaton/host.js';
import { createCoordinator } from './backend.js';

export function coordinatorPlugin(init: PluginInit = {}): ExtensionPlugin {
  return {
    name: 'buildautomaton-coordinator',
    services: [{ id: 'coordinator' }],
    createFromStores: () => createCoordinator(),
    runtime: init.runtime,
  };
}
