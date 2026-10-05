import type { SqlStore } from '@buildautomaton/runtime';
import type { Listing } from '../../types/listing.js';
import type { ListingPatch } from '../../types/implementation.js';
import { embed } from './embed.js';
import { loadListing } from './load.js';
import { asKind } from './rows.js';
import { listingSearchText } from './search-text.js';
import { artifactsWithDescription } from './with-description.js';
import { replaceChildren } from './write-children.js';

export function updateListing(sql: SqlStore, idOrSlug: string, patch: ListingPatch): Listing | null {
  const current = loadListing(sql, idOrSlug);
  if (!current) return null;
  const next = {
    ...current,
    kind: patch.kind ? asKind(patch.kind) : current.kind,
    name: patch.name?.trim() ?? current.name,
    summary: patch.summary ?? current.summary,
    version: patch.version ?? current.version,
    author: patch.author ?? current.author,
    plugins: patch.plugins ?? current.plugins,
    artifacts: current.artifacts,
    source: patch.source ?? current.source,
  };
  const artifacts = artifactsWithDescription({ ...next, ...patch, slug: current.slug });
  const vector = embed(listingSearchText({ ...next, artifacts: artifacts.map(asSearchArtifact) }));
  sql.transaction(() => {
    sql.run(
      'UPDATE marketplace_listings SET kind = ?, name = ?, summary = ?, version = ?, author = ?, plugins_json = ?, embedding_json = ? WHERE id = ?',
      [
        next.kind,
        next.name,
        next.summary,
        next.version,
        next.author,
        JSON.stringify(next.plugins),
        JSON.stringify(vector),
        current.id,
      ],
    );
    replaceChildren(sql, current.id, artifacts, next.source);
  });
  return loadListing(sql, current.id);
}

function asSearchArtifact(artifact: { kind: string; title?: string; files?: { path: string; content: string }[] }) {
  return { kind: artifact.kind, title: artifact.title ?? artifact.kind, files: artifact.files ?? [] };
}
