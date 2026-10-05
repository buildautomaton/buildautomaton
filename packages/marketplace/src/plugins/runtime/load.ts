import type { SqlStore } from '@buildautomaton/runtime';
import type { Listing } from '../../types/listing.js';
import { rowToArtifact, rowToFile, rowToSummary } from './rows.js';

export function findListingRow(sql: SqlStore, idOrSlug: string): Record<string, unknown> | undefined {
  return (
    sql.get('SELECT * FROM marketplace_listings WHERE id = ? OR slug = ?', [idOrSlug, idOrSlug]) ?? undefined
  );
}

export function loadListing(sql: SqlStore, idOrSlug: string): Listing | null {
  const row = findListingRow(sql, idOrSlug);
  if (!row) return null;
  const id = String(row.id);
  const artifacts = sql
    .all('SELECT * FROM marketplace_artifacts WHERE listing_id = ?', [id])
    .map(rowToArtifact);
  const source = sql.all('SELECT path, content FROM marketplace_files WHERE listing_id = ?', [id]).map(rowToFile);
  return { ...rowToSummary(row), artifacts, source };
}
