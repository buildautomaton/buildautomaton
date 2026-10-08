import { activityTitle } from './activity-title.js';
import type { TranscriptActivityItem, TranscriptViewBlock } from './block.js';

function isActivity(block: TranscriptViewBlock): block is TranscriptActivityItem {
  return block.kind === 'tool' || block.kind === 'thought' || block.kind === 'permission';
}

export function groupActivity(blocks: TranscriptViewBlock[]): TranscriptViewBlock[] {
  const out: TranscriptViewBlock[] = [];
  const run: TranscriptActivityItem[] = [];
  const flush = () => {
    if (run.length > 1) out.push({ kind: 'activity', title: activityTitle(run), items: [...run] });
    else if (run[0]) out.push(run[0]);
    run.length = 0;
  };
  for (const block of blocks) {
    if (isActivity(block)) run.push(block);
    else {
      flush();
      out.push(block);
    }
  }
  flush();
  return peelTrailingThought(out);
}

function peelTrailingThought(blocks: TranscriptViewBlock[]): TranscriptViewBlock[] {
  const last = blocks[blocks.length - 1];
  if (last?.kind !== 'activity') return blocks;
  const tail = last.items[last.items.length - 1];
  if (tail?.kind !== 'thought') return blocks;
  const items = last.items.slice(0, -1);
  const next = blocks.slice(0, -1);
  if (items.length > 1) next.push({ kind: 'activity', title: activityTitle(items), items });
  else if (items[0]) next.push(items[0]);
  next.push(tail);
  return next;
}
