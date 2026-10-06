import type { RuntimePlugin, ServiceContribution } from './registry-types.js';

/** A plugin's `services` list, or one contribution from `kind`. */
export function pluginServices(plugin: RuntimePlugin): ServiceContribution[] {
  if (plugin.services?.length) return plugin.services;
  if (!plugin.kind) return [];
  return [
    {
      id: plugin.kind,
      options: plugin.options,
      hooks: plugin.hooks,
      implementation: plugin.implementation,
    },
  ];
}
