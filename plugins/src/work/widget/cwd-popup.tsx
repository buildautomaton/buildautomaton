import { useRef, useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { AnchorPopup } from '../prompt/anchor-popup.js';
import { pageFromLocation } from './page-context.js';
import { pageHostWarning } from './page-host.js';
import { GitSections } from './cwd-sections.js';
import { useGit } from './use-git.js';

/** Hover-only session icon. Click does not select or open menus. */
export function CwdPopup({ note }: { note?: string }) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hide = useRef<number | null>(null);
  const { git, error } = useGit();
  const page = typeof window === 'undefined' ? null : pageFromLocation(window.location.search);
  const warning = page ? pageHostWarning(page) : null;

  function show() {
    if (hide.current) window.clearTimeout(hide.current);
    hide.current = null;
    setAnchor(buttonRef.current?.getBoundingClientRect() ?? null);
    setOpen(true);
  }

  function later() {
    if (hide.current) window.clearTimeout(hide.current);
    hide.current = window.setTimeout(() => setOpen(false), 120);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        tabIndex={-1}
        aria-label="Session location"
        aria-expanded={open}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground"
        onMouseEnter={show}
        onMouseLeave={later}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <MessageSquare className="h-4 w-4" aria-hidden />
      </button>
      <AnchorPopup
        open={open}
        anchor={anchor}
        drop="down"
        align="start"
        className="z-[80] w-72 rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-md"
        onMouseEnter={show}
        onMouseLeave={later}
      >
        {git ? (
          <GitSections git={git} note={note} page={page} warning={warning} />
        ) : (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            {error ? null : <Loader2 className="h-3 w-3 animate-spin" aria-hidden />}
            {error ?? 'Checking git'}
          </p>
        )}
      </AnchorPopup>
    </>
  );
}
