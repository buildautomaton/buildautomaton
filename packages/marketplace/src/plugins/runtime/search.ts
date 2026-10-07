import { sqlAll, type AnySqlStore } from '@buildautomaton/plugins';
import type { ListingKind, ListingSummary } from '../../types/listing.js';
import { cosine, embed } from './embed.js';
import { rowEmbedding, rowToSummary } from './rows.js';

export async function searchListings(
  sql: AnySqlStore,
  query: string,
  kind?: ListingKind,
): Promise<ListingSummary[]> {
  const phrase = query.trim();
  if (!phrase) return (await listRows(sql, kind)).map(rowToSummary);
  const needle = embed(phrase);
  return (await listRows(sql, kind))
    .map((row) => ({ ...rowToSummary(row), score: cosine(needle, rowEmbedding(row)) }))
    .sort((left, right) => (right.score ?? 0) - (left.score ?? 0));
}

export async function listRows(sql: AnySqlStore, kind?: ListingKind): Promise<Record<string, unknown>[]> {
  return kind
    ? sqlAll(sql, 'SELECT * FROM marketplace_listings WHERE kind = ? ORDER BY created_at DESC', [kind])
    : sqlAll(sql, 'SELECT * FROM marketplace_listings ORDER BY created_at DESC');
}
