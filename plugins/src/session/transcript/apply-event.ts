import type { TranscriptDraft, TranscriptEvent } from './block.js';
import { flushText, flushThought } from './block.js';
import { applyTool } from './apply-tool.js';
import { asRecord, textOf } from './text.js';

export function applyEvent(draft: TranscriptDraft, event: TranscriptEvent, request: string): void {
  if (event.kind === 'result') return applyResult(draft, event.payload);
  if (event.kind !== 'update') return;
  const rec = asRecord(event.payload);
  if (!rec) return;
  const kind = String(rec.sessionUpdate ?? rec.session_update ?? '');
  if (/user_message/i.test(kind)) return applyUser(draft, rec, request);
  if (/thought|reason/i.test(kind)) return appendThought(draft, textOf(rec));
  if (/tool_call/i.test(kind) || rec.toolCall != null || rec.tool_call != null) return applyTool(draft, rec);
  if (!kind || /agent_message|message_chunk|^message$/i.test(kind)) appendText(draft, textOf(rec));
}

function applyResult(draft: TranscriptDraft, payload: unknown): void {
  const rec = asRecord(payload) ?? {};
  if (typeof rec.error === 'string' && rec.error.trim()) {
    flushText(draft);
    flushThought(draft);
    draft.blocks.push({ kind: 'error', text: rec.error });
    return;
  }
  if (typeof rec.output === 'string') draft.resultText = rec.output.trim();
}

function applyUser(draft: TranscriptDraft, rec: Record<string, unknown>, request: string): void {
  const text = textOf(rec);
  if (!text || text === request) return;
  flushText(draft);
  flushThought(draft);
  draft.blocks.push({ kind: 'user', text });
}

function appendText(draft: TranscriptDraft, text: string): void {
  if (!text) return;
  flushThought(draft);
  draft.text += text;
  draft.sawText = true;
}

function appendThought(draft: TranscriptDraft, text: string): void {
  if (!text) return;
  flushText(draft);
  draft.thought += text;
}
