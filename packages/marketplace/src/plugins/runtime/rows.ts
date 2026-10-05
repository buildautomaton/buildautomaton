import type { ListingArtifact, ListingFile, ListingKind, ListingSummary } from '../../types/listing.js';

const KINDS = new Set<ListingKind>(['plugin', 'app']);

export function asKind(value: unknown): ListingKind {
  return KINDS.has(value as ListingKind) ? (value as ListingKind) : 'plugin';
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function rowToSummary(row: Record<string, unknown>): ListingSummary {
  return {
    id: String(row.id ?? ''),
    kind: asKind(row.kind),
    slug: String(row.slug ?? ''),
    name: String(row.name ?? ''),
    summary: String(row.summary ?? ''),
    version: String(row.version ?? '0.1.0'),
    author: String(row.author ?? ''),
    plugins: parseJson<string[]>(row.plugins_json, []),
    createdAt: String(row.created_at ?? ''),
  };
}

export function rowToArtifact(row: Record<string, unknown>): ListingArtifact {
  return {
    id: String(row.id ?? ''),
    kind: String(row.kind ?? ''),
    title: String(row.title ?? ''),
    files: parseJson<ListingFile[]>(row.files_json, []),
    payload: parseJson<Record<string, unknown>>(row.payload_json, {}),
  };
}

export function rowToFile(row: Record<string, unknown>): ListingFile {
  return { path: String(row.path ?? ''), content: String(row.content ?? '') };
}

export function rowEmbedding(row: Record<string, unknown>): number[] {
  return parseJson<number[]>(row.embedding_json, []);
}
