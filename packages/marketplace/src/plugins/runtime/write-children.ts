import type { SqlStore } from '@buildautomaton/runtime';
import type { ArtifactInput, ListingFile } from '../../types/listing.js';

export function replaceChildren(
  sql: SqlStore,
  listingId: string,
  artifacts: ArtifactInput[],
  source: ListingFile[],
): void {
  sql.run('DELETE FROM marketplace_artifacts WHERE listing_id = ?', [listingId]);
  sql.run('DELETE FROM marketplace_files WHERE listing_id = ?', [listingId]);
  for (const artifact of artifacts) {
    sql.run(
      'INSERT INTO marketplace_artifacts (id, listing_id, kind, title, files_json, payload_json) VALUES (?, ?, ?, ?, ?, ?)',
      [
        crypto.randomUUID(),
        listingId,
        artifact.kind,
        artifact.title ?? artifact.kind,
        JSON.stringify(artifact.files ?? []),
        JSON.stringify(artifact.payload ?? {}),
      ],
    );
  }
  for (const file of source) {
    sql.run('INSERT INTO marketplace_files (listing_id, path, content) VALUES (?, ?, ?)', [
      listingId,
      file.path,
      file.content,
    ]);
  }
}
