import type { PluginRegistry, RuntimePlugin } from './registry-types.js';
import { pluginServices } from './collect-services.js';

export type { PluginRegistry };

export function createPluginRegistry(): PluginRegistry {
  const plugins: RuntimePlugin[] = [];
  return {
    register(plugin) {
      if (!plugins.some((item) => item.name === plugin.name)) plugins.push(plugin);
    },
    all: () => [...plugins],
    byName: (name) => plugins.find((plugin) => plugin.name === name),
    byService(id) {
      return plugins.filter((plugin) => pluginServices(plugin).some((item) => item.id === id));
    },
  };
}
