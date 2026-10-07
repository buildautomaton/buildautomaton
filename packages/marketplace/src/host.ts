import {
  acpPlugin,
  createRuntime,
  fetchTransportPlugin,
  memorySessionPlugin,
  type RuntimeHandle,
} from '@buildautomaton/plugins/worker';
import { marketplaceCloudSet, marketplaceHttpEndpoints } from './marketplace-cloud.js';
import { marketplaceStorePlugins } from './host-plugins.js';
import type { MarketplaceHostBindings } from './host-bindings.js';

export type { MarketplaceHostBindings } from './host-bindings.js';

export async function createMarketplaceHost(bindings: MarketplaceHostBindings): Promise<RuntimeHandle> {
  const runtime = { cwd: '/', log: () => {} };
  return createRuntime({
    cwd: '/',
    log: runtime.log,
    plugins: [
      ...marketplaceStorePlugins(bindings, runtime),
      memorySessionPlugin({ runtime }),
      fetchTransportPlugin({ options: { endpoints: marketplaceHttpEndpoints() }, runtime }),
      acpPlugin(),
      ...marketplaceCloudSet({ runtime }),
    ],
  });
}
