import type { RuntimePlugin, ServiceContribution } from './registry-types.js';

/** Service contributions a plugin publishes. */
export function pluginServices(plugin: RuntimePlugin): ServiceContribution[] {
  return plugin.services ?? [];
}
