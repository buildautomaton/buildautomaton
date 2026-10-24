import { Loader2 } from 'lucide-react';
import type { TranscriptViewBlock } from '@plugins/session/transcript/blocks.js';
import { splitTurns } from '@plugins/session/transcript/split-turns.js';
import { TranscriptBlockView } from './block-view.js';
import { TurnSection } from './turn-section.js';

export function SessionTranscriptView({ blocks, live }: { blocks: TranscriptViewBlock[]; live: boolean }) {
  if (blocks.length === 0 && !live) {
    return <p className="p-4 text-sm text-muted-foreground">No transcript.</p>;
  }
  const { preamble, turns } = splitTurns(blocks);
  const last = turns[turns.length - 1];
  return (
    <div className="min-h-[200px] select-text break-words rounded-lg bg-card p-4 text-sm">
      <div className="max-w-none space-y-6">
        {preamble.map((block, index) => (
          <TranscriptBlockView key={`pre-${index}`} block={block} liveTail={live && turns.length === 0 && index === preamble.length - 1} />
        ))}
        {turns.map((turn, index) => (
          <TurnSection
            key={`turn-${index}`}
            turn={turn}
            live={live && turn === last}
            collapsed={turns.length > 1 && turn !== last}
          />
        ))}
        {live ? (
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
            Working…
          </p>
        ) : null}
      </div>
    </div>
  );
}
