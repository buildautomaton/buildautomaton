import type { PluginInit, RuntimePlugin, TransportEndpoint } from '@buildautomaton/runtime';
import { emailPlugin } from './plugins/runtime/plugin.js';

export function emailHttpEndpoints(): TransportEndpoint[] {
  return [{ plugin: 'email-sql', path: '/api' }];
}

export function emailSet(init: PluginInit = {}): RuntimePlugin[] {
  return [emailPlugin(init)];
}
