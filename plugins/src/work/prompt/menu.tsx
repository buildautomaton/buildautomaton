import { useEffect, useRef, useState } from 'react';
import { Bot, Brain, ChevronDown, Loader2 } from 'lucide-react';
import { AnchorPopup } from './anchor-popup.js';
import { PromptMenuItems, type PromptMenuItem } from './menu-items.js';

export type { PromptMenuItem };

const triggerClass =
  'flex h-auto max-w-[min(100%,12rem)] items-center gap-1 rounded-md bg-transparent px-1.5 py-1 text-xs font-normal text-foreground hover:bg-muted/60 disabled:opacity-60';

export function PromptMenu({
  label,
  icon,
  disabled,
  pending,
  drop = 'up',
  align = 'start',
  items,
  onPick,
}: {
  label: string;
  icon: 'agent' | 'model';
  disabled?: boolean;
  pending?: boolean;
  drop?: 'up' | 'down';
  align?: 'start' | 'end';
  items: PromptMenuItem[];
  onPick: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (rootRef.current?.contains(target)) return;
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
  const Icon = icon === 'agent' ? Bot : Brain;
  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        className={triggerClass}
        onClick={() => {
          setAnchor(rootRef.current?.getBoundingClientRect() ?? null);
          setOpen((current) => !current);
        }}
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" aria-hidden /> : <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />}
        <span className="min-w-0 truncate">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" aria-hidden />
      </button>
      <AnchorPopup
        open={open}
        anchor={anchor}
        drop={drop}
        align={align}
        className="z-[80] max-h-72 min-w-[10rem] overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
      >
        <PromptMenuItems
          items={items}
          onPick={(id) => {
            onPick(id);
            setOpen(false);
          }}
        />
      </AnchorPopup>
    </div>
  );
}
