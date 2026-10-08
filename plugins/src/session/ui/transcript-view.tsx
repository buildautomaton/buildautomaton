import { Loader2 } from 'lucide-react';
import type { TranscriptViewBlock } from '@plugins/session/transcript/blocks.js';
import { TranscriptBlockView } from './block-view.js';

export function SessionTranscriptView({ blocks, live }: { blocks: TranscriptViewBlock[]; live: boolean }) {
  if (blocks.length === 0 && !live) {
    return <p className="p-4 text-sm text-muted-foreground">No transcript.</p>;
  }
  return (
    <div className="min-h-[200px] select-text break-words rounded-lg bg-card p-4 text-sm">
      <div className="max-w-none space-y-4">
        {blocks.map((block, index) => (
          <TranscriptBlockView
            key={block.kind === 'tool' ? block.key : `${block.kind}-${index}`}
            block={block}
            liveTail={live && index === blocks.length - 1}
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
