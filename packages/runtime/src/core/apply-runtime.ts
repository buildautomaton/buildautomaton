import { pluginServices } from './collect-services.js';
import type { Runtime } from './registry-types.js';

/** Provide each plugin's services, then run registered appliers in order. */
export function applyRuntime(runtime: Runtime): void {
  for (const plugin of runtime.plugins.all()) {
    for (const contrib of pluginServices(plugin)) {
      if (contrib.interface) runtime.services.define(contrib.id, contrib.interface);
      runtime.services.provide({ ...contrib, plugin: plugin.name });
    }
  }
  const jobs = runtime.plugins.all().flatMap((plugin) =>
    pluginServices(plugin).map((contrib) => ({
      plugin,
      contrib,
      order: runtime.appliers.get(contrib.id)?.order ?? 1000,
    })),
  );
  jobs.sort((left, right) => left.order - right.order);
  for (const { plugin, contrib } of jobs) {
    runtime.appliers.get(contrib.id)?.apply(runtime, plugin, contrib);
  }
}
