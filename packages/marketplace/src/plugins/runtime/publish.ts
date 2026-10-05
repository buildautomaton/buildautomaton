import type { SqlStore } from '@buildautomaton/runtime';
import type { Listing, PublishListingInput } from '../../types/listing.js';
import { embed } from './embed.js';
import { loadListing } from './load.js';
import { asKind } from './rows.js';
import { listingSearchText } from './search-text.js';
import { artifactsWithDescription } from './with-description.js';
import { replaceChildren } from './write-children.js';

export function publishListing(sql: SqlStore, input: PublishListingInput): Listing {
  const artifacts = artifactsWithDescription(input);
  const source = input.source ?? [];
  const plugins = input.plugins ?? [];
  const summary = input.summary ?? '';
  const listing = {
    id: crypto.randomUUID(),
    kind: asKind(input.kind),
    slug: input.slug.trim(),
    name: input.name.trim(),
    summary,
    version: input.version ?? '0.1.0',
    author: input.author ?? '',
    plugins,
    createdAt: new Date().toISOString(),
  };
  const vector = embed(listingSearchText({ ...listing, artifacts: withFiles(artifacts), source }));
  sql.transaction(() => {
    sql.run(
      'INSERT INTO marketplace_listings (id, kind, slug, name, summary, version, author, plugins_json, embedding_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        listing.id,
        listing.kind,
        listing.slug,
        listing.name,
        listing.summary,
        listing.version,
        listing.author,
        JSON.stringify(plugins),
        JSON.stringify(vector),
        listing.createdAt,
      ],
    );
    replaceChildren(sql, listing.id, artifacts, source);
  });
  return loadListing(sql, listing.id)!;
}

function withFiles(artifacts: PublishListingInput['artifacts']) {
  return (artifacts ?? []).map((artifact) => ({
    kind: artifact.kind,
    title: artifact.title ?? artifact.kind,
    files: artifact.files ?? [],
  }));
}
