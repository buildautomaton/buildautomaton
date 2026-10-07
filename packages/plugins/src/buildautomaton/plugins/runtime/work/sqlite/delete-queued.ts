import type { SqlStore } from '@plugins/buildautomaton/host.js';
import { findBySource, sourceStatus } from './source-key.js';
import { deleteWorkRow } from './delete-row.js';

export function deleteQueuedBySource(db: SqlStore, sourceKey: string): string | undefined {
  const id = findBySource(db, sourceKey);
  if (!id || sourceStatus(db, sourceKey) !== 'queued') return undefined;
  deleteWorkRow(db, id);
  return id;
}
