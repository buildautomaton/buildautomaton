import type { PluginInit, RuntimePlugin, TransportEndpoint } from '@buildautomaton/plugins/worker';
import { marketplacePlugin } from './plugins/runtime/plugin.js';
import { marketplaceToolsPlugin } from './plugins/tools/plugin.js';

export function marketplaceHttpEndpoints(): TransportEndpoint[] {
  return [{ plugin: 'marketplace-sql', path: '/api/marketplace' }];
}

/** Marketplace plugins only. Pair with `workerHostPlugins` on Cloudflare. */
export function marketplaceCloudSet(init: PluginInit = {}): RuntimePlugin[] {
  const runtime = init.runtime;
  return [marketplacePlugin({ runtime }), marketplaceToolsPlugin({ runtime })];
}
