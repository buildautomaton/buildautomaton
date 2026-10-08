import { useState, type ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';
import { EmptyState } from '@buildautomaton/ui-runtime';
import type { DiskSession } from './client.js';
import { SessionRow } from './session-row.js';
import { SessionTranscriptModal } from './transcript-modal.js';
import { useDiskSessions } from './use-sessions.js';
import { useNow } from './use-now.js';

export function SessionList({
  extra,
  include,
  empty,
}: {
  extra?: (session: DiskSession) => ReactNode;
  include?: (session: DiskSession) => boolean;
  empty?: { title: string; description: string } | null;
}) {
  const { sessions, error } = useDiskSessions(true);
  const shown = include ? sessions.filter(include) : sessions;
  const now = useNow();
  const [openId, setOpenId] = useState<string | null>(null);
  if (error && shown.length === 0) return <p className="p-4 text-sm text-destructive">{error}</p>;
  if (shown.length === 0 && empty === null) return null;
  const blank = empty ?? { title: 'No sessions yet', description: 'A prompt here or on the start screen opens a session.' };
  return (
    <>
      {shown.length === 0 ? (
        <EmptyState icon={MessageCircle} title={blank.title} description={blank.description} />
      ) : (
        <ul>
          {shown.map((session) => (
            <li key={session.id} className="border-b border-border">
              <SessionRow session={session} now={now} onOpen={() => setOpenId(session.id)} />
              {extra?.(session)}
            </li>
          ))}
        </ul>
      )}
      {openId ? <SessionTranscriptModal id={openId} onClose={() => setOpenId(null)} /> : null}
    </>
  );
}
