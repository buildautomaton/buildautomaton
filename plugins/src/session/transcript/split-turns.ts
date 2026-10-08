import type { TranscriptViewBlock } from './block.js';

export type TranscriptTurn = {
  user: Extract<TranscriptViewBlock, { kind: 'user' }>;
  response: TranscriptViewBlock[];
};

export function splitTurns(blocks: TranscriptViewBlock[]): {
  preamble: TranscriptViewBlock[];
  turns: TranscriptTurn[];
} {
  const preamble: TranscriptViewBlock[] = [];
  const turns: TranscriptTurn[] = [];
  let current: TranscriptTurn | null = null;
  for (const block of blocks) {
    if (block.kind === 'user') {
      if (current) turns.push(current);
      current = { user: block, response: [] };
      continue;
    }
    if (current) current.response.push(block);
    else preamble.push(block);
  }
  if (current) turns.push(current);
  return { preamble, turns };
}
