import { useEffect, useRef, useState } from 'react';
import { Bot, Brain, Check, ChevronDown, Loader2, Sparkles } from 'lucide-react';

export type PromptMenuItem = {
  id: string;
  label: string;
  detected?: boolean;
  selected?: boolean;
  disabled?: boolean;
};

const triggerClass =
  'flex h-auto max-w-[min(100%,12rem)] items-center gap-1 rounded-md bg-transparent px-1.5 py-1 text-xs font-normal text-foreground hover:bg-muted/60 disabled:opacity-60';

export function PromptMenu({
  label,
  icon,
  disabled,
  pending,
  items,
  onPick,
}: {
  label: string;
  icon: 'agent' | 'model';
  disabled?: boolean;
  pending?: boolean;
  items: PromptMenuItem[];
  onPick: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
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
        onClick={() => setOpen((current) => !current)}
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" aria-hidden /> : <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />}
        <span className="min-w-0 truncate">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" aria-hidden />
      </button>
      {open ? (
        <ul role="menu" className="absolute bottom-full left-0 z-[80] mb-1 max-h-72 min-w-[10rem] overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
          {items.map((item) => (
            <li key={item.id || 'default'} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent disabled:cursor-default disabled:opacity-50"
                onClick={() => {
                  if (item.disabled) return;
                  onPick(item.id);
                  setOpen(false);
                }}
              >
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.detected ? <Sparkles className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" aria-label="Detected" /> : null}
                <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>
                  {item.selected ? <Check className="h-4 w-4" /> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
