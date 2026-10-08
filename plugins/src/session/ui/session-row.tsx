import { Loader2 } from 'lucide-react';
import { sessionElapsed } from '@plugins/session/transcript/elapsed.js';
import { sessionTitle } from '@plugins/session/transcript/user-request.js';
import type { DiskSession } from './client.js';

export function SessionRow({
  session,
  now,
  onOpen,
}: {
  session: DiskSession;
  now: number;
  onOpen: () => void;
}) {
  const running = session.status === 'running';
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/60"
      onClick={onOpen}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {running ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Running" /> : null}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">{sessionTitle(session.prompt)}</span>
      <span className="shrink-0 font-mono text-xs text-muted-foreground">{sessionElapsed(session, now)}</span>
    </button>
  );
}
