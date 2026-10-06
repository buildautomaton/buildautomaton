import type { HttpPlugin, HttpPluginInit } from '@plugins/transport/http/types/plugin.js';
import type { HostTransport } from '@plugins/transport/transport/host.js';
import { createHttpRegistry } from './registry.js';
import { attachFetch } from './attach-fetch.js';

/** HTTP plugin that does not bind a Node port. Pair with `handle.fetch`. */
export function fetchTransportPlugin(init: HttpPluginInit = {}): HttpPlugin {
  const registry = createHttpRegistry();
  const transport = createFetchTransport();
  return {
    name: 'transport-http',
    kind: 'http',
    options: { id: init.options?.id ?? transport.id, listen: false, ...init.options },
    hooks: init.hooks,
    implementation: { start: transport.start, stop: transport.stop, ...init.implementation },
    registry,
    attachFetch,
    runtime: init.runtime,
  };
}

export function createFetchTransport(): HostTransport {
  return {
    id: 'http',
    start(commandHost) {
      commandHost.onListening?.({ url: '', port: 0 });
    },
    stop() {},
  };
}
