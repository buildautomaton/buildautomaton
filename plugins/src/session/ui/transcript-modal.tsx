import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bot, Loader2, X } from 'lucide-react';
import { Button, ColumnHeader } from '@buildautomaton/ui-runtime';
import { transcriptBlocks } from '@plugins/session/transcript/blocks.js';
import { sessionElapsed } from '@plugins/session/transcript/elapsed.js';
import { sessionTitle } from '@plugins/session/transcript/user-request.js';
import { SessionTranscriptView } from './transcript-view.js';
import { useDiskSnapshot } from './use-snapshot.js';
import { useNow } from './use-now.js';

export function SessionTranscriptModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { snapshot, error } = useDiskSnapshot(id);
  const now = useNow();
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  if (typeof document === 'undefined') return null;
  const session = snapshot?.session;
  const title = session ? sessionTitle(session.prompt) : 'Session';
  const live = session?.status === 'running';
  return createPortal(
    <div data-ba-overlay className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex h-[min(40rem,90vh)] w-[min(48rem,100%)] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ColumnHeader title={title} icon={Bot} trailing={<ModalTools live={live} elapsed={session ? sessionElapsed(session, now) : ''} onClose={onClose} />} />
        <TranscriptBody error={error} ready={Boolean(snapshot)} live={live} blocks={session ? transcriptBlocks(session, snapshot?.events ?? []) : []} />
      </div>
    </div>,
    document.body,
  );
}

function ModalTools({ live, elapsed, onClose }: { live: boolean; elapsed: string; onClose: () => void }) {
  return (
    <span className="flex items-center gap-2">
      {live ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden /> : null}
      {elapsed ? <span className="font-mono text-xs text-muted-foreground">{elapsed}</span> : null}
      <Button type="button" size="icon" variant="ghost" aria-label="Close transcript" className="h-8 w-8" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </span>
  );
}

function TranscriptBody({
  error,
  ready,
  live,
  blocks,
}: {
  error: string | null;
  ready: boolean;
  live: boolean;
  blocks: ReturnType<typeof transcriptBlocks>;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      {error ? <p className="p-4 text-sm text-destructive">{error}</p> : null}
      {!ready && !error ? (
        <p className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading transcript…
        </p>
      ) : null}
      {ready ? <SessionTranscriptView blocks={blocks} live={live} /> : null}
    </div>
  );
}
