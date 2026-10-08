import { describe, expect, it } from 'vitest';
import { mixedFeed } from './mixed-feed.js';
import type { WorkArtifact, WorkItem } from '../board/types.js';

const item = (id: string, status: WorkItem['status'], at: string): WorkItem => ({
  id,
  title: id,
  content: '',
  status,
  priority: 'medium',
  queueRank: 0,
  paused: false,
  prompt: '',
  agentContext: '',
  origin: { kind: 'draft', workId: id },
  decisions: [],
  questions: [],
  sessionIds: [],
  project: '',
  createdAt: at,
  updatedAt: at,
  completedAt: null,
});

const artifact = (id: string, at: string): WorkArtifact => ({
  id,
  workId: null,
  title: id,
  description: '',
  kinds: [],
  sessionId: null,
  files: [],
  questions: {},
  project: '',
  createdAt: at,
});

describe('mixedFeed', () => {
  it('interleaves drafts and completed work, newest first', () => {
    const entries = mixedFeed(
      [item('draft-old', 'draft', '2026-01-01T00:00:00.000Z'), item('queued', 'queued', '2026-03-01T00:00:00.000Z')],
      [artifact('built', '2026-02-01T00:00:00.000Z')],
      '',
    );
    expect(entries.map((entry) => entry.id)).toEqual(['artifact:built', 'draft-old']);
  });

  it('keeps a newer draft above older completed work', () => {
    const entries = mixedFeed(
      [item('draft-new', 'draft', '2026-04-01T00:00:00.000Z')],
      [artifact('built', '2026-02-01T00:00:00.000Z')],
      '',
    );
    expect(entries.map((entry) => entry.kind)).toEqual(['draft', 'completed']);
  });

  it('shows in-progress tasks above older completed work', () => {
    const entries = mixedFeed(
      [item('building', 'in_progress', '2026-04-01T00:00:00.000Z')],
      [artifact('built', '2026-02-01T00:00:00.000Z')],
      '',
    );
    expect(entries.map((entry) => entry.kind)).toEqual(['progress', 'completed']);
  });
});
