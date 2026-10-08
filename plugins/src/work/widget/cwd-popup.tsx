import { useEffect, useRef, useState } from 'react';
import { Folder, Loader2 } from 'lucide-react';
import type { GitContext } from '@plugins/git/types.js';
import { loadGitContext } from './load-git.js';
import { pageFromLocation } from './page-context.js';
import { pageHostWarning } from './page-host.js';
import { GitSections } from './cwd-sections.js';

export function CwdPopup({ note }: { note?: string }) {
  const [open, setOpen] = useState(false);
  const [git, setGit] = useState<GitContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return;
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

  useEffect(() => {
    if (!open) return;
    let stop = false;
    setError(null);
    loadGitContext()
      .then((next) => {
        if (!stop) setGit(next);
      })
      .catch((err: unknown) => {
        if (!stop) setError(err instanceof Error ? err.message : 'Could not read git');
      });
    return () => {
      stop = true;
    };
  }, [open]);

  const page = typeof window === 'undefined' ? null : pageFromLocation(window.location.search);
  const warning = page ? pageHostWarning(page) : null;

  function toggle() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) setAnchor({ top: rect.bottom + 6, right: Math.max(8, window.innerWidth - rect.right) });
    setOpen((current) => !current);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-label="Working directory"
        title="Working directory"
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
        onClick={toggle}
      >
        <Folder className="h-4 w-4" />
      </button>
      {open && anchor ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Working directory"
          className="fixed z-[80] w-72 rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-md"
          style={{ top: anchor.top, right: anchor.right }}
        >
          {git ? (
            <GitSections git={git} note={note} page={page} warning={warning} />
          ) : (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              {error ? null : <Loader2 className="h-3 w-3 animate-spin" aria-hidden />}
              {error ?? 'Checking git'}
            </p>
          )}
        </div>
      ) : null}
    </>
  );
}
