import type { SqlStore } from '@buildautomaton/runtime';
import type { ListingKind, ListingSummary } from '../../types/listing.js';
import { cosine, embed } from './embed.js';
import { rowEmbedding, rowToSummary } from './rows.js';

export function searchListings(sql: SqlStore, query: string, kind?: ListingKind): ListingSummary[] {
  const phrase = query.trim();
  if (!phrase) return listRows(sql, kind).map(rowToSummary);
  const needle = embed(phrase);
  return listRows(sql, kind)
    .map((row) => ({ ...rowToSummary(row), score: cosine(needle, rowEmbedding(row)) }))
    .sort((left, right) => (right.score ?? 0) - (left.score ?? 0));
}

export function listRows(sql: SqlStore, kind?: ListingKind): Record<string, unknown>[] {
  return kind
    ? sql.all('SELECT * FROM marketplace_listings WHERE kind = ? ORDER BY created_at DESC', [kind])
    : sql.all('SELECT * FROM marketplace_listings ORDER BY created_at DESC');
}
