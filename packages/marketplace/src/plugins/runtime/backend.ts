import type { SqlStore } from '@buildautomaton/runtime';
import type { MarketplaceImplementation } from '../../types/implementation.js';
import { loadListing } from './load.js';
import { publishListing } from './publish.js';
import { listRows, searchListings } from './search.js';
import { rowToSummary } from './rows.js';
import { seedMarketplace } from './seed.js';
import { updateListing } from './update.js';

export function createMarketplaceBackend(sql: SqlStore): MarketplaceImplementation {
  const market: MarketplaceImplementation = {
    list: (kind) => listRows(sql, kind).map(rowToSummary),
    search: (query, kind) => searchListings(sql, query, kind),
    get: (idOrSlug) => loadListing(sql, idOrSlug),
    source: (idOrSlug, filePath) => sourceFiles(sql, idOrSlug, filePath),
    publish: (input) => publishListing(sql, input),
    update: (idOrSlug, patch) => updateListing(sql, idOrSlug, patch),
    remove: (idOrSlug) => {
      const found = loadListing(sql, idOrSlug);
      if (!found) return false;
      sql.transaction(() => {
        sql.run('DELETE FROM marketplace_files WHERE listing_id = ?', [found.id]);
        sql.run('DELETE FROM marketplace_artifacts WHERE listing_id = ?', [found.id]);
        sql.run('DELETE FROM marketplace_listings WHERE id = ?', [found.id]);
      });
      return true;
    },
  };
  if (market.list().length === 0) seedMarketplace(market);
  return market;
}

function sourceFiles(sql: SqlStore, idOrSlug: string, filePath?: string) {
  const listing = loadListing(sql, idOrSlug);
  if (!listing) return null;
  if (!filePath) return listing.source;
  return listing.source.find((file) => file.path === filePath) ?? null;
}
