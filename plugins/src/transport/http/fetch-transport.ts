import type { HttpPlugin, HttpPluginInit } from '@plugins/transport/http/types/plugin.js';
import type { HostTransport } from '@plugins/transport/transport/host.js';
import { createHttpRegistry } from './registry.js';
import { attachFetch } from './attach-fetch.js';

/** HTTP plugin that does not bind a Node port. Pair with `handle.fetch`. */
export function fetchTransportPlugin(init: HttpPluginInit = {}): HttpPlugin {
  const registry = createHttpRegistry();
  const transport = createFetchTransport();
  const options = { id: init.options?.id ?? transport.id, listen: false, ...init.options };
  const implementation = { start: transport.start, stop: transport.stop, ...init.implementation };
  return {
    name: 'transport-http',
    description: 'Fetch HTTP transport that does not bind a port. Use on Cloudflare Workers with handle.fetch.',
    targetRuntime: 'node',
    services: [{ id: 'http', options, hooks: init.hooks, implementation }],
    options,
    hooks: init.hooks,
    implementation,
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
