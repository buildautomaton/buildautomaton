import { Check, Sparkles } from 'lucide-react';

export type PromptMenuItem = {
  id: string;
  label: string;
  detected?: boolean;
  selected?: boolean;
  disabled?: boolean;
};

export function PromptMenuItems({
  items,
  onPick,
}: {
  items: PromptMenuItem[];
  onPick: (id: string) => void;
}) {
  return (
    <ul role="menu">
      {items.map((item) => (
        <li key={item.id || 'default'} role="none">
          <button
            type="button"
            role="menuitem"
            disabled={item.disabled}
            className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent disabled:cursor-default disabled:opacity-50"
            onClick={() => {
              if (!item.disabled) onPick(item.id);
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
  );
}
