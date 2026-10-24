import { Check, Loader2, Plus } from 'lucide-react';
import { sessionTitle } from '@plugins/session/transcript/user-request.js';
import type { DiskSession } from '@plugins/session/ui/client.js';
import { useLive } from '@plugins/live/ui/context.js';
import { CwdPopup } from './cwd-popup.js';
import { sessionIsRunning } from './active-running.js';

export function SessionMenu({
  sessions,
  sessionId,
  note,
  onPick,
}: {
  sessions: DiskSession[];
  sessionId: string | null;
  note?: string;
  onPick: (id: string) => void;
}) {
  const { sessions: live } = useLive();
  return (
    <ul role="menu" className="min-w-[14rem]">
      <li role="none">
        <button
          type="button"
          role="menuitem"
          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
          onClick={() => onPick('')}
        >
          <Plus className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <span className="min-w-0 flex-1 truncate">New chat</span>
          {!sessionId ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
        </button>
      </li>
      {sessions.map((session) => (
        <li key={session.id} role="none" className="flex items-center gap-1 rounded-sm pr-2 hover:bg-accent">
          <CwdPopup note={note} />
          <button
            type="button"
            role="menuitem"
            className="flex min-w-0 flex-1 items-center gap-2 py-1.5 pr-1 text-left text-sm"
            onClick={() => onPick(session.id)}
          >
            <span className="min-w-0 flex-1 truncate">{sessionTitle(session.prompt)}</span>
            {sessionIsRunning(session.id, live) || session.status === 'running' ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-emerald-500" aria-label="Running" />
            ) : null}
            {session.id === sessionId ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
          </button>
        </li>
      ))}
    </ul>
  );
}
