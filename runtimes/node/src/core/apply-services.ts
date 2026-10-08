import type { PluginSlots } from './plugin-slots.js';
import { pluginServices } from './collect-services.js';
import { serviceApplier } from './service-appliers.js';

/** Apply each plugin service contribution. Unknown ids use the `*` applier. */
export function applyServiceContributions(slots: PluginSlots): void {
  const jobs = slots.plugins.flatMap((plugin) =>
    pluginServices(plugin).map((contrib) => ({
      plugin,
      contrib,
      order: serviceApplier(contrib.id)?.order ?? serviceApplier('*')?.order ?? 1000,
    })),
  );
  jobs.sort((left, right) => left.order - right.order);
  const wildcards = new Set<string>();
  for (const { plugin, contrib } of jobs) {
    const applier = serviceApplier(contrib.id) ?? serviceApplier('*');
    if (!applier) continue;
    if (applier === serviceApplier('*')) {
      if (wildcards.has(plugin.name)) continue;
      wildcards.add(plugin.name);
    }
    applier.apply(slots, plugin, contrib);
  }
}
