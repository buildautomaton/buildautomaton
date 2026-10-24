export type TranscriptEvent = {
  kind: string;
  payload: unknown;
};

export type TranscriptToolBlock = { kind: 'tool'; key: string; title: string; status: string; detail: string };
export type TranscriptThoughtBlock = { kind: 'thought'; text: string };
export type TranscriptPermissionBlock = { kind: 'permission'; key: string; title: string; status: string; detail: string };

export type TranscriptActivityItem = TranscriptToolBlock | TranscriptThoughtBlock | TranscriptPermissionBlock;

export type TranscriptViewBlock =
  | { kind: 'user'; text: string }
  | { kind: 'text'; text: string }
  | TranscriptThoughtBlock
  | TranscriptToolBlock
  | TranscriptPermissionBlock
  | { kind: 'activity'; title: string; items: TranscriptActivityItem[] }
  | { kind: 'files'; paths: string[] }
  | { kind: 'detail'; title: string; detail: string }
  | { kind: 'error'; text: string };

export type ToolBlock = TranscriptToolBlock;

export type TranscriptDraft = {
  blocks: TranscriptViewBlock[];
  tools: Map<string, ToolBlock>;
  text: string;
  thought: string;
  sawText: boolean;
  resultText: string;
  seq: number;
};

export function emptyDraft(): TranscriptDraft {
  return { blocks: [], tools: new Map(), text: '', thought: '', sawText: false, resultText: '', seq: 0 };
}

export function flushText(draft: TranscriptDraft): void {
  if (!draft.text) return;
  draft.blocks.push({ kind: 'text', text: draft.text });
  draft.text = '';
}

export function flushThought(draft: TranscriptDraft): void {
  if (!draft.thought) return;
  draft.blocks.push({ kind: 'thought', text: draft.thought });
  draft.thought = '';
}
