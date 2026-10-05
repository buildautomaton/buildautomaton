import { sessionThreads, type SessionThread } from '../work/session-threads.js';
import { sameProject } from '../work/project-name.js';
import type { WorkArtifact, WorkItem } from '../work/types.js';

export type MixedEntry =
  | { kind: 'draft'; id: string; at: string; item: WorkItem }
  | { kind: 'completed'; id: string; at: string; thread: SessionThread };

export function mixedFeed(items: WorkItem[], artifacts: WorkArtifact[], project: string): MixedEntry[] {
  const drafts = items
    .filter((item) => item.status === 'draft' && sameProject(item.project, project))
    .map((item) => ({ kind: 'draft' as const, id: item.id, at: item.updatedAt || item.createdAt, item }));
  const completed = sessionThreads(artifacts.filter((artifact) => sameProject(artifact.project, project))).map(
    (thread) => ({
      kind: 'completed' as const,
      id: thread.key,
      at: thread.artifacts[thread.artifacts.length - 1]!.createdAt,
      thread,
    }),
  );
  return [...drafts, ...completed].sort((a, b) => b.at.localeCompare(a.at) || a.id.localeCompare(b.id));
}
