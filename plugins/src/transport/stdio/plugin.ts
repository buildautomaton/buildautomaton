import type { PluginInit } from '@buildautomaton/runtime';
import type { TransportHooks } from '@plugins/transport/transport/hooks.js';
import type { TransportPlugin } from '@plugins/transport/transport/plugin.js';
import type { StdioTransportOptions } from '@plugins/transport/transport/options.js';
import { createStdioTransport } from './transport.js';

export function stdioTransportPlugin(
  init: PluginInit<StdioTransportOptions, TransportHooks> = {},
): TransportPlugin {
  const transport = createStdioTransport(init.runtime?.log);
  const options = { id: init.options?.id ?? transport.id };
  const implementation = { start: transport.start, stop: transport.stop };
  return {
    name: 'transport-stdio',
    description: 'Stdio transport. Use when an editor or agent talks to the runtime over stdin/stdout.',
    targetRuntime: 'node',
    services: [{ id: 'transport', options, hooks: init.hooks, implementation }],
    options,
    hooks: init.hooks,
    implementation,
    runtime: init.runtime,
  };
}
