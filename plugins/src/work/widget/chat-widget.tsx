import { useEffect, useRef, useState } from 'react';
import { LiveProvider } from '@plugins/live/ui/context.js';
import { WidgetShell } from './widget-shell.js';
import { WidgetFab } from './widget-fab.js';
import { readWidgetOpen, writeWidgetOpen } from './open-state.js';
import { useSetup } from './use-setup.js';

export function ChatWidget() {
  useSetup();
  const [open, setOpen] = useState(readWidgetOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);

  function setOpenState(next: boolean) {
    writeWidgetOpen(next);
    setOpen(next);
  }

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target) || tabRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('[data-ba-overlay],[data-ba-popup],[role=dialog]')) return;
      setOpenState(false);
    }
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [open]);

  return (
    <LiveProvider>
      {open ? (
        <div
          ref={panelRef}
          id="buildautomaton-widget"
          className="fixed bottom-24 right-6 z-50 flex h-[min(40rem,calc(100vh-8rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl"
        >
          <WidgetShell />
        </div>
      ) : null}
      <WidgetFab open={open} tabRef={tabRef} onToggle={() => setOpenState(!open)} />
    </LiveProvider>
  );
}
