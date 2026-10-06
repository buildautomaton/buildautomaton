import type { HarnessPlugin, HarnessPluginInit } from '@plugins/harnesses/harness/plugin.js';
import type { HarnessOptions } from '@plugins/harnesses/harness/options.js';
import type { HarnessImplementation } from '@plugins/harnesses/harness/implementation.js';
export function defineHarnessPlugin(
  name: string,
  defaultOptions: HarnessOptions,
  defaultImplementation: HarnessImplementation,
) {
  return (init: HarnessPluginInit = {}): HarnessPlugin => ({
    name,
    kind: 'harness',
    options: { ...defaultOptions, ...init.options },
    hooks: init.hooks,
    implementation: { ...defaultImplementation, ...init.implementation },
    runtime: init.runtime,
  });
}
