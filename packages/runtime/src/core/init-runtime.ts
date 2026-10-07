import { createApplierRegistry } from './applier-registry.js';
import { wireRuntime } from './apply-runtime.js';
import { startRuntime, stopRuntime } from './lifecycle.js';
import { createPluginRegistry } from './plugin-registry.js';
import { createServiceRegistry } from './service-registry.js';
import type { LogFn, Runtime, RuntimePlugin } from './registry-types.js';

export type InitRuntimeOptions = {
  cwd?: string;
  log?: LogFn;
  plugins?: readonly RuntimePlugin[];
};

/** Register plugins, wire their declared services, and expose start/stop. */
export function initRuntime(options: InitRuntimeOptions = {}): Runtime {
  const plugins = createPluginRegistry();
  const services = createServiceRegistry();
  const appliers = createApplierRegistry();
  const log = options.log ?? (() => {});
  const cwd = options.cwd ?? '/';
  const runtime: Runtime = {
    cwd,
    log,
    plugins,
    services,
    start: () => startRuntime(runtime),
    stop: () => stopRuntime(runtime),
  };
  for (const plugin of options.plugins ?? []) plugins.register(plugin);
  wireRuntime(runtime, appliers);
  return runtime;
}
