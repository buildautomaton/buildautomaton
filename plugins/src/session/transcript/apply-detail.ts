import type { TranscriptDraft } from './block.js';
import { flushText, flushThought } from './block.js';
import { detailText, str } from './text.js';

export function applyDetail(draft: TranscriptDraft, rec: Record<string, unknown>): void {
  flushText(draft);
  flushThought(draft);
  const raw = str(rec.title) ?? str(rec.kind) ?? str(rec.sessionUpdate) ?? 'Plan';
  const title = /todo/i.test(raw) ? 'Todos' : /task/i.test(raw) ? 'Task' : /plan/i.test(raw) ? 'Plan' : raw;
  const detail = detailText(rec.entries ?? rec.todos ?? rec.plan ?? rec.tasks ?? rec.params, rec.content);
  draft.blocks.push({ kind: 'detail', title, detail });
}
