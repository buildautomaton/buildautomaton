import type { HarnessPlugin, HarnessPluginInit } from '@plugins/harnesses/harness/plugin.js';
import type { HarnessOptions } from '@plugins/harnesses/harness/options.js';
import type { HarnessImplementation } from '@plugins/harnesses/harness/implementation.js';
export function defineHarnessPlugin(
  name: string,
  defaultOptions: HarnessOptions,
  defaultImplementation: HarnessImplementation,
) {
  return (init: HarnessPluginInit = {}): HarnessPlugin => {
    const options = { ...defaultOptions, ...init.options };
    const implementation = { ...defaultImplementation, ...init.implementation };
    return {
      name,
      services: [{ id: 'harness', options, hooks: init.hooks, implementation }],
      options,
      hooks: init.hooks,
      implementation,
      runtime: init.runtime,
    };
  };
}
