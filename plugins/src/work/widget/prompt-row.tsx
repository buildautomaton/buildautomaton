import { Loader2 } from 'lucide-react';
import { elapsedLabel } from '@plugins/session/transcript/elapsed.js';
import { formatRelativeShort } from '@plugins/session/transcript/ago.js';
import { promptPreview, type SessionPrompt } from '@plugins/session/transcript/prompts.js';

export function PromptRow({
  prompt,
  now,
  onOpen,
}: {
  prompt: SessionPrompt;
  now: number;
  onOpen: () => void;
}) {
  const running = prompt.status === 'running';
  const elapsed = elapsedLabel(prompt.sentAt, running ? now : Date.parse(prompt.endedAt) || now);
  return (
    <button
      type="button"
      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/60"
      onClick={onOpen}
    >
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
        {running ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Running" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 whitespace-pre-wrap text-sm">{promptPreview(prompt.text)}</span>
        <span className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <span>{elapsed}</span>
          <span>{formatRelativeShort(prompt.sentAt, now)}</span>
        </span>
      </span>
    </button>
  );
}
