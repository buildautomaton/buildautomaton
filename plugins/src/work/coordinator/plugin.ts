import type { ExtensionPlugin, PluginInit } from '@plugins/work/host.js';
import { createCoordinator } from './backend.js';

export function coordinatorPlugin(init: PluginInit = {}): ExtensionPlugin {
  return {
    name: 'buildautomaton-coordinator',
    description: 'Starts agent sessions for queued work. Use when submitted work should run on a configured harness.',
    targetRuntime: 'node',
    services: [{ id: 'coordinator' }],
    createFromStores: () => createCoordinator(),
    runtime: init.runtime,
  };
}
