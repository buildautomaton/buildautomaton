import type { MarketplaceImplementation } from '../../types/implementation.js';
import { createMarketplaceOps } from './ops.js';
import { seedMarketplace } from './seed.js';
import type { MarketplaceStores } from './stores.js';

export function createMarketplaceBackend(stores: MarketplaceStores): MarketplaceImplementation {
  const inner = createMarketplaceOps(stores);
  let ready: Promise<void> | undefined;
  async function ensure() {
    ready ??= (async () => {
      if ((await inner.list()).length === 0) await seedMarketplace(inner);
    })();
    await ready;
  }
  return {
    list: async (kind) => {
      await ensure();
      return inner.list(kind);
    },
    search: async (query, kind) => {
      await ensure();
      return inner.search(query, kind);
    },
    get: async (idOrSlug) => {
      await ensure();
      return inner.get(idOrSlug);
    },
    source: async (idOrSlug, filePath) => {
      await ensure();
      return inner.source(idOrSlug, filePath);
    },
    publish: async (input) => {
      await ensure();
      return inner.publish(input);
    },
    update: async (idOrSlug, patch) => {
      await ensure();
      return inner.update(idOrSlug, patch);
    },
    remove: async (idOrSlug) => {
      await ensure();
      return inner.remove(idOrSlug);
    },
  };
}
