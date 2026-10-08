import type { SqlStore } from '@plugins/work/host.js';
import type { WorkArtifact } from '@plugins/work/types/work/artifact.js';
import { loadArtifact } from './artifacts.js';
import { run } from './sql.js';

export function setArtifactProject(db: SqlStore, id: string, project: string): WorkArtifact | null {
  if (!loadArtifact(db, id)) return null;
  run(db, 'UPDATE artifact SET project = ? WHERE id = ?', [project.trim(), id]);
  return loadArtifact(db, id);
}
