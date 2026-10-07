import type { Listing } from '../../types/listing.js';
import { rowToSummary } from './rows.js';
import { findListingRow, loadArtifacts, loadSource } from './load.js';
import type { MarketplaceStores } from './stores.js';

export async function loadListing(stores: MarketplaceStores, idOrSlug: string): Promise<Listing | null> {
  const row = await findListingRow(stores.listings, idOrSlug);
  if (!row) return null;
  const id = String(row.id);
  const version = String(row.version ?? '0.1.0');
  const sql = await Promise.resolve(stores.plugins.open(id));
  const [artifacts, source] = await Promise.all([
    loadArtifacts(sql, stores.files, id, version),
    loadSource(sql, stores.files, id, version),
  ]);
  return { ...rowToSummary(row), artifacts, source };
}
