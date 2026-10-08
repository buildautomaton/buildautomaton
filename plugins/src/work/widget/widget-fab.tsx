import type { RefObject } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLive } from '@plugins/live/ui/context.js';
import { LiveStatus } from './live-status.js';
import { activeSessionRunning } from './active-running.js';

export function WidgetFab({
  open,
  tabRef,
  onToggle,
}: {
  open: boolean;
  tabRef: RefObject<HTMLButtonElement | null>;
  onToggle: () => void;
}) {
  const { sessions } = useLive();
  const running = activeSessionRunning(sessions);
  return (
    <button
      ref={tabRef}
      type="button"
      aria-expanded={open}
      aria-controls="buildautomaton-widget"
      aria-label={open ? 'Close BuildAutomaton' : 'BuildAutomaton'}
      title="BuildAutomaton"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_8px_24px_rgba(0,0,0,.28)] hover:bg-zinc-800"
      onClick={onToggle}
    >
      {open ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-6 w-6" aria-hidden />}
      <span className="absolute bottom-1 right-1">
        <LiveStatus running={running} />
      </span>
    </button>
  );
}
