import type { PluginInit } from '@buildautomaton/runtime';
import type { TransportHooks } from '@plugins/transport/transport/hooks.js';
import type { TransportPlugin } from '@plugins/transport/transport/plugin.js';
import type { StdioTransportOptions } from '@plugins/transport/transport/options.js';
import { createStdioTransport } from './transport.js';

export function stdioTransportPlugin(
  init: PluginInit<StdioTransportOptions, TransportHooks> = {},
): TransportPlugin {
  const transport = createStdioTransport(init.runtime?.log);
  return {
    name: 'transport-stdio',
    kind: 'transport',
    options: { id: init.options?.id ?? transport.id },
    hooks: init.hooks,
    implementation: { start: transport.start, stop: transport.stop },
    runtime: init.runtime,
  };
}
