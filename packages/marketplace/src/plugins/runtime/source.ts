import type { ListingFile } from '../../types/listing.js';
import { loadListing } from './load-listing.js';
import type { MarketplaceStores } from './stores.js';

export async function sourceFiles(
  stores: MarketplaceStores,
  idOrSlug: string,
  filePath?: string,
): Promise<ListingFile[] | ListingFile | null> {
  const listing = await loadListing(stores, idOrSlug);
  if (!listing) return null;
  if (!filePath) return listing.source;
  return listing.source.find((file) => file.path === filePath) ?? null;
}
