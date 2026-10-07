import type { RuntimeHandle } from '@buildautomaton/plugins/worker';
import { createMarketplaceHost, type MarketplaceHostBindings } from './host.js';

let cached: RuntimeHandle | undefined;

export async function marketplaceHandle(bindings: MarketplaceHostBindings): Promise<RuntimeHandle> {
  if (!cached) {
    cached = await createMarketplaceHost(bindings);
    await cached.start();
  }
  return cached;
}
