import { fileRead, sqlAll, sqlGet, type AnyFileStore, type AnySqlStore } from '@buildautomaton/plugins';
import type { Listing, ListingArtifact, ListingFile } from '../../types/listing.js';
import { parseJson, rowToArtifact, rowToSummary } from './rows.js';
import { artifactFileKey, sourceFileKey } from './file-keys.js';

export async function findListingRow(
  sql: AnySqlStore,
  idOrSlug: string,
): Promise<Record<string, unknown> | undefined> {
  return sqlGet(sql, 'SELECT * FROM marketplace_listings WHERE id = ? OR slug = ?', [idOrSlug, idOrSlug]);
}

export async function loadArtifacts(
  sql: AnySqlStore,
  files: AnyFileStore,
  listingId: string,
  version: string,
): Promise<ListingArtifact[]> {
  const rows = await sqlAll(sql, 'SELECT * FROM plugin_artifacts WHERE version = ?', [version]);
  return Promise.all(rows.map((row) => hydrateArtifact(files, listingId, version, row)));
}

async function hydrateArtifact(
  files: AnyFileStore,
  listingId: string,
  version: string,
  row: Record<string, unknown>,
): Promise<ListingArtifact> {
  const artifact = rowToArtifact(row);
  const paths = parseJson<{ path: string }[]>(row.files_json, []);
  artifact.files = await Promise.all(
    paths.map(async ({ path }) => ({
      path,
      content: (await fileRead(files, artifactFileKey(listingId, version, artifact.id, path))) ?? '',
    })),
  );
  return artifact;
}

export async function loadSource(
  sql: AnySqlStore,
  files: AnyFileStore,
  listingId: string,
  version: string,
): Promise<ListingFile[]> {
  const rows = await sqlAll(sql, 'SELECT path FROM plugin_files WHERE version = ?', [version]);
  return Promise.all(
    rows.map(async (row) => {
      const path = String(row.path ?? '');
      return { path, content: (await fileRead(files, sourceFileKey(listingId, version, path))) ?? '' };
    }),
  );
}
