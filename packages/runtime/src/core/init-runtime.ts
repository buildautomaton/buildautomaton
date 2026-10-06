import { applyRuntime } from './apply-runtime.js';
import { createApplierRegistry } from './applier-registry.js';
import { startRuntime, stopRuntime } from './lifecycle.js';
import { createPluginRegistry } from './plugin-registry.js';
import { createServiceRegistry } from './service-registry.js';
import type { LogFn, Runtime, RuntimePlugin } from './registry-types.js';

export type InitRuntimeOptions = {
  cwd?: string;
  log?: LogFn;
  plugins?: readonly RuntimePlugin[];
};

/** Plugin registry, service registry, appliers, and start/stop. */
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
    appliers,
    apply() {
      applyRuntime(runtime);
    },
    start: () => startRuntime(runtime),
    stop: () => stopRuntime(runtime),
  };
  for (const plugin of options.plugins ?? []) plugins.register(plugin);
  return runtime;
}
