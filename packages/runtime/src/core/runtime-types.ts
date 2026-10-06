import type { LogFn, RuntimePlugin } from './registry-types.js';
import type { PluginRegistry } from './plugin-registry.js';
import type { ServiceRegistry } from './service-registry.js';

export type RuntimeOptions = {
  cwd: string;
  plugins?: RuntimePlugin[];
  log?: LogFn;
  isShutdownRequested?: () => boolean;
};

/** Started host. Domain fields (engine, fetch wiring) come from plugins via extras. */
export type RuntimeHandle = {
  cwd: string;
  plugins: PluginRegistry;
  services: ServiceRegistry;
  extras: Record<string, unknown>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  fetch: (request: Request) => Promise<Response>;
};
