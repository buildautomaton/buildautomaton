import type { HttpPlugin, HttpPluginInit } from '@plugins/transport/http/types/plugin.js';
import { createHttpTransport } from './transport.js';
import { createHttpRegistry } from './registry.js';
import { attachFetch } from './attach-fetch.js';

export function httpTransportPlugin(init: HttpPluginInit = {}): HttpPlugin {
  const registry = createHttpRegistry();
  const transport = createHttpTransport({ ...init.options, registry });
  return {
    name: 'transport-http',
    kind: 'http',
    options: { id: init.options?.id ?? transport.id, ...init.options },
    hooks: init.hooks,
    implementation: { start: transport.start, stop: transport.stop, ...init.implementation },
    registry,
    attachFetch,
    runtime: init.runtime,
  };
}
