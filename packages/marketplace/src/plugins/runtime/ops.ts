import type { MarketplaceImplementation } from '../../types/implementation.js';
import { loadListing } from './load-listing.js';
import { publishListing } from './publish.js';
import { listRows, searchListings } from './search.js';
import { rowToSummary } from './rows.js';
import { removeListing } from './remove.js';
import { sourceFiles } from './source.js';
import { updateListing } from './update.js';
import type { MarketplaceStores } from './stores.js';

export function createMarketplaceOps(stores: MarketplaceStores): MarketplaceImplementation {
  return {
    list: async (kind) => (await listRows(stores.listings, kind)).map(rowToSummary),
    search: (query, kind) => searchListings(stores.listings, query, kind),
    get: (idOrSlug) => loadListing(stores, idOrSlug),
    source: (idOrSlug, filePath) => sourceFiles(stores, idOrSlug, filePath),
    publish: (input) => publishListing(stores, input),
    update: (idOrSlug, patch) => updateListing(stores, idOrSlug, patch),
    remove: (idOrSlug) => removeListing(stores, idOrSlug),
  };
}
