import type { MarketplaceImplementation } from '../../types/implementation.js';
import { directorPluginSeed } from './seed-director.js';
import { emailAppSeed, emailPluginSeed } from './seed-email.js';
import { marketplaceAppSeed, marketplacePluginSeed } from './seed-marketplace.js';

export function seedMarketplace(market: MarketplaceImplementation): void {
  for (const listing of [
    emailPluginSeed(),
    directorPluginSeed(),
    marketplacePluginSeed(),
    emailAppSeed(),
    marketplaceAppSeed(),
  ]) {
    market.publish(listing);
  }
}
