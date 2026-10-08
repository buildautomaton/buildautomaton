import type { TranscriptDraft } from './block.js';
import { flushText, flushThought } from './block.js';
import { asRecord, detailText, str } from './text.js';

export function applyPermission(draft: TranscriptDraft, rec: Record<string, unknown>): void {
  flushText(draft);
  flushThought(draft);
  const params = asRecord(rec.params) ?? {};
  const tool = asRecord(params.toolCall) ?? asRecord(params.tool_call) ?? asRecord(rec.toolCall) ?? {};
  const id = str(rec.requestId) ?? str(rec.request_id) ?? str(params.requestId) ?? `perm-${draft.seq++}`;
  const title = str(rec.title) ?? str(tool.title) ?? str(rec.method) ?? str(rec.kind) ?? 'Permission';
  const status = str(rec.status) ?? str(params.status) ?? 'pending';
  const detail = detailText(params, rec.options ?? rec.payload);
  draft.blocks.push({ kind: 'permission', key: id, title, status, detail });
}
