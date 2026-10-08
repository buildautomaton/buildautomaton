import { describe, expect, it } from 'vitest';
import { summarizeQueue } from './queue-summary.js';
import type { WorkItem } from '../board/types.js';

const row = (patch: Partial<WorkItem> & Pick<WorkItem, 'id' | 'status'>): WorkItem => ({
  title: patch.id,
  content: '',
  priority: 'medium',
  queueRank: 0,
  paused: false,
  prompt: '',
  agentContext: '',
  origin: { kind: 'draft', workId: patch.id },
  decisions: [],
  questions: [],
  sessionIds: [],
  project: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  completedAt: null,
  ...patch,
});

describe('summarizeQueue', () => {
  it('counts building and waiting items without listing drafts', () => {
    const summary = summarizeQueue([
      row({ id: 'draft', status: 'draft' }),
      row({ id: 'now', status: 'in_progress', title: 'Ship login' }),
      row({ id: 'later', status: 'queued', title: 'Dark mode', queueRank: 1, createdAt: '2026-01-02T00:00:00.000Z' }),
      row({ id: 'first', status: 'queued', title: 'Header', queueRank: 3, createdAt: '2026-01-03T00:00:00.000Z' }),
    ]);
    expect(summary.building).toBe('Ship login');
    expect(summary.waiting).toEqual(['Header', 'Dark mode']);
    expect(summary.count).toBe(3);
  });

  it('lists an empty queue', () => {
    expect(summarizeQueue([row({ id: 'draft', status: 'draft' })])).toEqual({
      building: null,
      waiting: [],
      count: 0,
    });
  });
});
