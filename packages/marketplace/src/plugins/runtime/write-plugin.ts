import { fileWrite, sqlRun, type AnyFileStore, type AnySqlStore } from '@buildautomaton/plugins';
import type { ArtifactInput, ListingFile } from '../../types/listing.js';
import { artifactFileKey, sourceFileKey } from './file-keys.js';

export async function writePluginState(
  sql: AnySqlStore,
  files: AnyFileStore,
  listingId: string,
  version: string,
  artifacts: ArtifactInput[],
  source: ListingFile[],
  meta: { summary: string; author: string },
): Promise<void> {
  await sqlRun(sql, 'INSERT OR REPLACE INTO plugin_versions (version, created_at, summary, author) VALUES (?, ?, ?, ?)', [
    version,
    new Date().toISOString(),
    meta.summary,
    meta.author,
  ]);
  await sqlRun(sql, 'DELETE FROM plugin_artifacts WHERE version = ?', [version]);
  await sqlRun(sql, 'DELETE FROM plugin_files WHERE version = ?', [version]);
  await writeArtifacts(sql, files, listingId, version, artifacts);
  await writeSource(sql, files, listingId, version, source);
}

async function writeArtifacts(
  sql: AnySqlStore,
  files: AnyFileStore,
  listingId: string,
  version: string,
  artifacts: ArtifactInput[],
): Promise<void> {
  for (const artifact of artifacts) {
    const id = crypto.randomUUID();
    await sqlRun(
      sql,
      'INSERT INTO plugin_artifacts (id, version, kind, title, files_json, payload_json) VALUES (?, ?, ?, ?, ?, ?)',
      [
        id,
        version,
        artifact.kind,
        artifact.title ?? artifact.kind,
        JSON.stringify((artifact.files ?? []).map((file) => ({ path: file.path }))),
        JSON.stringify(artifact.payload ?? {}),
      ],
    );
    for (const file of artifact.files ?? []) {
      await fileWrite(files, artifactFileKey(listingId, version, id, file.path), file.content);
    }
  }
}

async function writeSource(
  sql: AnySqlStore,
  files: AnyFileStore,
  listingId: string,
  version: string,
  source: ListingFile[],
): Promise<void> {
  for (const file of source) {
    await sqlRun(sql, 'INSERT INTO plugin_files (version, path) VALUES (?, ?)', [version, file.path]);
    await fileWrite(files, sourceFileKey(listingId, version, file.path), file.content);
  }
}
