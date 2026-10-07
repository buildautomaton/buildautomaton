import type { LogFn, RuntimePlugin } from './registry-types.js';
import { createPluginSlots, type PluginSlots } from './plugin-slots.js';
import { pluginServices } from './collect-services.js';
import { applyServiceContributions } from './apply-services.js';

/** Fill the plugin and service registries, then apply each service. */
export function applyPlugins(
  plugins: readonly RuntimePlugin[],
  _options: { log: LogFn; cwd: string },
): PluginSlots {
  const slots = createPluginSlots();
  slots.plugins = [...plugins];
  for (const plugin of plugins) {
    slots.pluginRegistry.register(plugin);
    for (const contrib of pluginServices(plugin)) {
      if (contrib.interface) slots.services.define(contrib.id, contrib.interface);
      slots.services.provide({ ...contrib, plugin: plugin.name });
    }
  }
  applyServiceContributions(slots);
  return slots;
}
