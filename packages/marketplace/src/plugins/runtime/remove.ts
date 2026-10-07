import { fileRemove, sqlAll, sqlRun } from '@buildautomaton/plugins';
import { parseJson } from './rows.js';
import { artifactFileKey, sourceFileKey } from './file-keys.js';
import { loadListing } from './load-listing.js';
import type { MarketplaceStores } from './stores.js';

export async function removeListing(stores: MarketplaceStores, idOrSlug: string): Promise<boolean> {
  const found = await loadListing(stores, idOrSlug);
  if (!found) return false;
  const sql = await Promise.resolve(stores.plugins.open(found.id));
  const versions = await sqlAll(sql, 'SELECT version FROM plugin_versions');
  for (const row of versions) await removeVersionFiles(stores, sql, found.id, String(row.version));
  await sqlRun(sql, 'DELETE FROM plugin_artifacts');
  await sqlRun(sql, 'DELETE FROM plugin_files');
  await sqlRun(sql, 'DELETE FROM plugin_versions');
  await sqlRun(stores.listings, 'DELETE FROM marketplace_listings WHERE id = ?', [found.id]);
  return true;
}

async function removeVersionFiles(
  stores: MarketplaceStores,
  sql: Awaited<ReturnType<MarketplaceStores['plugins']['open']>>,
  listingId: string,
  version: string,
): Promise<void> {
  const files = await sqlAll(sql, 'SELECT path FROM plugin_files WHERE version = ?', [version]);
  for (const file of files) await fileRemove(stores.files, sourceFileKey(listingId, version, String(file.path)));
  const artifacts = await sqlAll(sql, 'SELECT id, files_json FROM plugin_artifacts WHERE version = ?', [version]);
  for (const artifact of artifacts) {
    for (const file of parseJson<{ path: string }[]>(artifact.files_json, [])) {
      await fileRemove(stores.files, artifactFileKey(listingId, version, String(artifact.id), file.path));
    }
  }
}
