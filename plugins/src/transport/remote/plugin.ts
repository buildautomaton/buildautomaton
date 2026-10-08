import type { PluginInit } from '@buildautomaton/runtime';
import type { TransportHooks } from '@plugins/transport/transport/hooks.js';
import type { TransportPlugin } from '@plugins/transport/transport/plugin.js';
import type { RemoteTransportOptions, RemoteTransportImplementation } from '@plugins/transport/transport/options.js';
import { createRemoteTransport } from './transport.js';

export function remoteTransportPlugin(
  init: PluginInit<RemoteTransportOptions, TransportHooks, RemoteTransportImplementation> & {
    implementation: RemoteTransportImplementation;
  },
): TransportPlugin {
  const transport = createRemoteTransport(init.implementation);
  const options = { id: init.options?.id ?? transport.id };
  const implementation = { start: transport.start, stop: transport.stop };
  return {
    name: 'transport-remote',
    description: 'Remote transport adapter. Use when this process should proxy to another runtime over HTTP.',
    targetRuntime: 'node',
    services: [{ id: 'transport', options, hooks: init.hooks, implementation }],
    options,
    hooks: init.hooks,
    implementation,
    runtime: init.runtime,
  };
}
