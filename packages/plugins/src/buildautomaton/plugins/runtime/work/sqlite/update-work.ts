import type { SqlStore } from '@plugins/buildautomaton/host.js';
import type { WorkItem, WorkPatch } from '@plugins/buildautomaton/types/work/records.js';
import type { WorkHub } from './hub.js';
import { patchWork } from './patch-work.js';
import { unqueueWork } from './unqueue-work.js';
import { queueDraft } from './queue-draft.js';

export function updateWorkRow(
  db: SqlStore,
  hub: WorkHub,
  id: string,
  patch: WorkPatch,
): WorkItem | null {
  if (patch.unqueue) return unqueueWork(db, id);
  if (patch.queued) return queueDraft(db, hub, id);
  return patchWork(db, id, patch);
}
