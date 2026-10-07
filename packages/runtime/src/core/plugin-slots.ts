import type { RuntimePlugin } from './registry-types.js';
import { createPluginRegistry, type PluginRegistry } from './plugin-registry.js';
import { createServiceRegistry, type ServiceRegistry } from './service-registry.js';

/** Generic bag. Plugins write domain fields onto `extras`. */
export type PluginSlots = {
  pluginRegistry: PluginRegistry;
  services: ServiceRegistry;
  plugins: RuntimePlugin[];
  extras: Record<string, unknown>;
  ready: Promise<void>[];
};

export function createPluginSlots(): PluginSlots {
  return {
    pluginRegistry: createPluginRegistry(),
    services: createServiceRegistry(),
    plugins: [],
    extras: {},
    ready: [],
  };
}
