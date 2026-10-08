import type { TranscriptDraft } from './block.js';
import { flushText, flushThought } from './block.js';
import { asRecord, str } from './text.js';

export function applyFiles(draft: TranscriptDraft, payload: unknown): void {
  const rec = asRecord(payload) ?? {};
  const paths = filePaths(rec);
  if (!paths.length) return;
  flushText(draft);
  flushThought(draft);
  const last = draft.blocks[draft.blocks.length - 1];
  if (last?.kind === 'files') {
    last.paths = [...new Set([...last.paths, ...paths])];
    return;
  }
  draft.blocks.push({ kind: 'files', paths });
}

function filePaths(rec: Record<string, unknown>): string[] {
  const single = str(rec.path) ?? str(rec.file);
  if (single) return [single];
  const raw = rec.paths ?? rec.files ?? rec.changes;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (typeof item === 'string' && item.trim()) return [item.trim()];
    return str(asRecord(item)?.path) ? [str(asRecord(item)?.path)!] : [];
  });
}
