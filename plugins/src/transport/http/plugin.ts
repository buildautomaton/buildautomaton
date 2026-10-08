import type { HttpPlugin, HttpPluginInit } from '@plugins/transport/http/types/plugin.js';
import { createHttpTransport } from './transport.js';
import { createHttpRegistry } from './registry.js';
import { attachFetch } from './attach-fetch.js';

export function httpTransportPlugin(init: HttpPluginInit = {}): HttpPlugin {
  const registry = createHttpRegistry();
  const transport = createHttpTransport({ ...init.options, registry });
  const options = { id: init.options?.id ?? transport.id, ...init.options };
  const implementation = { start: transport.start, stop: transport.stop, ...init.implementation };
  return {
    name: 'transport-http',
    description: 'Node HTTP transport. Use to serve MCP, REST, and websockets from a local or cloud process.',
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
