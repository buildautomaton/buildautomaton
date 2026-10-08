import type { WorkArtifact } from '../board/types.js';

export function artifactsForSession(artifacts: WorkArtifact[], sessionId: string): WorkArtifact[] {
  return artifacts
    .filter((artifact) => artifact.sessionId === sessionId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}
