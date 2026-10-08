import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { WidgetShell } from './widget-shell.js';
import { readWidgetOpen, writeWidgetOpen } from './open-state.js';
import { useSetup } from './use-setup.js';

export function ChatWidget() {
  useSetup();
  const [open, setOpen] = useState(readWidgetOpen);

  function toggle() {
    setOpen((current) => {
      const next = !current;
      writeWidgetOpen(next);
      return next;
    });
  }

  return (
    <>
      {open ? (
        <div
          id="buildautomaton-widget"
          className="fixed bottom-24 right-6 z-50 flex h-[min(40rem,calc(100vh-8rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
        >
          <WidgetShell />
        </div>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="buildautomaton-widget"
        aria-label={open ? 'Close BuildAutomaton' : 'BuildAutomaton'}
        title="BuildAutomaton"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_8px_24px_rgba(0,0,0,.28)] hover:bg-zinc-800"
        onClick={toggle}
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-6 w-6" aria-hidden />}
      </button>
    </>
  );
}
