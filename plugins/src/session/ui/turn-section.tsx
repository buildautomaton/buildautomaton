import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@buildautomaton/ui-runtime';
import type { TranscriptTurn } from '@plugins/session/transcript/split-turns.js';
import { TranscriptBlockView } from './block-view.js';
import { UserMessage } from './user-message.js';

export function TurnSection({ turn, live, collapsed }: { turn: TranscriptTurn; live: boolean; collapsed: boolean }) {
  const [open, setOpen] = useState(!collapsed);
  const last = turn.response[turn.response.length - 1];
  return (
    <section className="space-y-3">
      <UserMessage text={turn.user.text} />
      {turn.response.length > 0 ? (
        <div>
          {open
            ? turn.response.map((block, index) => (
                <TranscriptBlockView
                  key={`${block.kind}-${index}`}
                  block={block}
                  liveTail={live && block === last}
                />
              ))
            : null}
          <ResponseToggle open={open} onToggle={() => setOpen((current) => !current)} />
        </div>
      ) : null}
    </section>
  );
}

function ResponseToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="h-px min-w-0 flex-1 bg-border" aria-hidden />
      <button
        type="button"
        className="inline-flex items-center px-1.5 py-0.5 text-muted-foreground hover:text-foreground"
        aria-expanded={open}
        aria-label={open ? 'Collapse response' : 'Expand response'}
        onClick={onToggle}
      >
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      <div className="h-px min-w-0 flex-1 bg-border" aria-hidden />
    </div>
  );
}
