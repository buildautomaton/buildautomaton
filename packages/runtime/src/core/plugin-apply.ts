import type { LogFn, RuntimePlugin } from './registry-types.js';
import { emptyPluginSlots, type PluginSlots } from './plugin-slots.js';
import { pluginServices } from './collect-services.js';
import { applyServiceContributions } from './apply-services.js';

/** Register plugins and wire each declared service into slots. */
export function createPluginSlots(
  plugins: readonly RuntimePlugin[] = [],
  _options: { log: LogFn; cwd: string } = { log: () => {}, cwd: '/' },
): PluginSlots {
  const slots = emptyPluginSlots();
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
