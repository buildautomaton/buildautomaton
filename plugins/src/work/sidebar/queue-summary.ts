import type { WorkItem } from '../board/types.js';

export type QueueSummary = {
  building: string | null;
  waiting: string[];
  count: number;
};

type QueueRow = Pick<WorkItem, 'id' | 'title' | 'status' | 'paused' | 'queueRank' | 'createdAt'>;

export function summarizeQueue(items: QueueRow[]): QueueSummary {
  const building = items.filter((item) => item.status === 'in_progress');
  const waiting = items.filter((item) => item.status === 'queued' || item.status === 'held').sort(compareQueue);
  return {
    building: building[0] ? label(building[0]) : null,
    waiting: waiting.map(label),
    count: building.length + waiting.length,
  };
}

function label(item: Pick<WorkItem, 'title'>): string {
  return item.title.trim() || 'Queued work';
}

function compareQueue(a: QueueRow, b: QueueRow): number {
  if (a.paused !== b.paused) return a.paused ? 1 : -1;
  return b.queueRank - a.queueRank || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id);
}
