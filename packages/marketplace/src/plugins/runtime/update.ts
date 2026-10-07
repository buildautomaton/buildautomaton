import { sqlRun } from '@buildautomaton/plugins';
import type { Listing } from '../../types/listing.js';
import type { ListingPatch } from '../../types/implementation.js';
import { embed } from './embed.js';
import { loadListing } from './load-listing.js';
import { asKind } from './rows.js';
import { listingSearchText } from './search-text.js';
import { artifactsWithDescription } from './with-description.js';
import { writePluginState } from './write-plugin.js';
import type { MarketplaceStores } from './stores.js';

export async function updateListing(
  stores: MarketplaceStores,
  idOrSlug: string,
  patch: ListingPatch,
): Promise<Listing | null> {
  const current = await loadListing(stores, idOrSlug);
  if (!current) return null;
  const next = {
    ...current,
    kind: patch.kind ? asKind(patch.kind) : current.kind,
    name: patch.name?.trim() ?? current.name,
    summary: patch.summary ?? current.summary,
    version: patch.version ?? current.version,
    author: patch.author ?? current.author,
    plugins: patch.plugins ?? current.plugins,
    source: patch.source ?? current.source,
  };
  const artifacts = artifactsWithDescription({ ...next, ...patch, slug: current.slug });
  const vector = embed(listingSearchText({ ...next, artifacts: artifacts.map(asSearchArtifact) }));
  await sqlRun(
    stores.listings,
    'UPDATE marketplace_listings SET kind = ?, name = ?, summary = ?, version = ?, author = ?, plugins_json = ?, embedding_json = ? WHERE id = ?',
    [next.kind, next.name, next.summary, next.version, next.author, JSON.stringify(next.plugins), JSON.stringify(vector), current.id],
  );
  const sql = await Promise.resolve(stores.plugins.open(current.id));
  await writePluginState(sql, stores.files, current.id, next.version, artifacts, next.source, next);
  return loadListing(stores, current.id);
}

function asSearchArtifact(artifact: { kind: string; title?: string; files?: { path: string; content: string }[] }) {
  return { kind: artifact.kind, title: artifact.title ?? artifact.kind, files: artifact.files ?? [] };
}
