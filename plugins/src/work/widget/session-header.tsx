import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { sessionTitle } from '@plugins/session/transcript/user-request.js';
import type { DiskSession } from '@plugins/session/ui/client.js';
import { useLive } from '@plugins/live/ui/context.js';
import { AnchorPopup } from '../prompt/anchor-popup.js';
import { CwdPopup } from './cwd-popup.js';
import { SessionMenu } from './session-menu.js';
import { sessionIsRunning } from './active-running.js';

export function SessionHeader({
  sessionId,
  sessions,
  note,
  onChange,
}: {
  sessionId: string | null;
  sessions: DiskSession[];
  note?: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const { sessions: live } = useLive();
  const selected = sessions.find((session) => session.id === sessionId);
  const label = selected ? sessionTitle(selected.prompt) : 'New chat';
  const running = sessionIsRunning(sessionId, live) || selected?.status === 'running';

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (fieldRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('[data-ba-popup]')) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={fieldRef} className="min-w-0 flex-1">
      <div className="flex w-full min-w-0 items-center gap-1 rounded-md px-1.5 py-1 hover:bg-muted/60">
        <CwdPopup note={note} />
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Chat session"
          className="flex min-w-0 flex-1 items-center gap-1 text-left"
          onClick={() => {
            setAnchor(fieldRef.current?.getBoundingClientRect() ?? null);
            setOpen((current) => !current);
          }}
        >
          <span className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight">{label}</span>
          {running ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-emerald-500" aria-label="Running" /> : null}
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" aria-hidden />
        </button>
      </div>
      <AnchorPopup
        open={open}
        anchor={anchor}
        drop="down"
        align="start"
        className="z-[80] max-h-72 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <SessionMenu
          sessions={sessions}
          sessionId={sessionId}
          note={note}
          onPick={(id) => {
            onChange(id);
            setOpen(false);
          }}
        />
      </AnchorPopup>
    </div>
  );
}
