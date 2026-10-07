import type { PublishListingInput } from '../../types/listing.js';
import type { ListingPatch } from '../../types/implementation.js';
import { asKind } from './rows.js';

export function parsePublish(body: unknown): PublishListingInput | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Expected JSON' };
  const rec = body as Record<string, unknown>;
  const slug = typeof rec.slug === 'string' ? rec.slug.trim() : '';
  const name = typeof rec.name === 'string' ? rec.name.trim() : '';
  if (!slug || !name) return { error: 'slug and name are required' };
  return {
    kind: asKind(rec.kind),
    slug,
    name,
    summary: typeof rec.summary === 'string' ? rec.summary : '',
    description: typeof rec.description === 'string' ? rec.description : undefined,
    version: typeof rec.version === 'string' ? rec.version : undefined,
    author: typeof rec.author === 'string' ? rec.author : undefined,
    plugins: stringList(rec.plugins),
    artifacts: Array.isArray(rec.artifacts) ? (rec.artifacts as PublishListingInput['artifacts']) : undefined,
    source: Array.isArray(rec.source) ? (rec.source as PublishListingInput['source']) : undefined,
  };
}

export function parsePatch(body: unknown): ListingPatch | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Expected JSON' };
  const rec = body as Record<string, unknown>;
  const patch: ListingPatch = {};
  if (rec.kind !== undefined) patch.kind = asKind(rec.kind);
  if (typeof rec.name === 'string') patch.name = rec.name;
  if (typeof rec.summary === 'string') patch.summary = rec.summary;
  if (typeof rec.description === 'string') patch.description = rec.description;
  if (typeof rec.version === 'string') patch.version = rec.version;
  if (typeof rec.author === 'string') patch.author = rec.author;
  if (rec.plugins !== undefined) patch.plugins = stringList(rec.plugins);
  if (Array.isArray(rec.artifacts)) patch.artifacts = rec.artifacts as ListingPatch['artifacts'];
  if (Array.isArray(rec.source)) patch.source = rec.source as ListingPatch['source'];
  return patch;
}

function stringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === 'string');
}
