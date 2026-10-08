import type { TranscriptDraft } from './block.js';
import { flushText, flushThought } from './block.js';
import { asRecord, detailText, str } from './text.js';

export function applyTool(draft: TranscriptDraft, rec: Record<string, unknown>): void {
  flushText(draft);
  flushThought(draft);
  const nested = asRecord(rec.toolCall) ?? asRecord(rec.tool_call) ?? {};
  const id =
    str(rec.toolCallId) ?? str(rec.tool_call_id) ?? str(nested.toolCallId) ?? str(nested.id) ?? `tool-${draft.seq++}`;
  const title = str(rec.title) ?? str(nested.title) ?? str(rec.name) ?? str(nested.name) ?? 'Tool';
  const status = str(rec.status) ?? str(nested.status) ?? 'pending';
  const detail = detailText(
    rec.rawInput ?? nested.rawInput ?? rec.input ?? nested.input,
    rec.rawOutput ?? nested.rawOutput ?? rec.output ?? nested.output ?? rec.content,
  );
  const prev = draft.tools.get(id);
  if (prev) {
    const nextTitle = str(rec.title) ?? str(nested.title) ?? str(rec.name) ?? str(nested.name);
    if (nextTitle) prev.title = nextTitle;
    const nextStatus = str(rec.status) ?? str(nested.status);
    if (nextStatus) prev.status = nextStatus;
    if (detail) prev.detail = detail;
    return;
  }
  const block = { kind: 'tool' as const, key: id, title, status, detail };
  draft.tools.set(id, block);
  draft.blocks.push(block);
}
