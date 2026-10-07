import type { MarketplaceImplementation } from '../../types/implementation.js';
import { directorPluginSeed } from './seed-director.js';
import { emailAppSeed, emailPluginSeed } from './seed-email.js';
import { marketplaceAppSeed, marketplacePluginSeed } from './seed-marketplace.js';

export async function seedMarketplace(market: MarketplaceImplementation): Promise<void> {
  for (const listing of [
    emailPluginSeed(),
    directorPluginSeed(),
    marketplacePluginSeed(),
    emailAppSeed(),
    marketplaceAppSeed(),
  ]) {
    await market.publish(listing);
  }
}
