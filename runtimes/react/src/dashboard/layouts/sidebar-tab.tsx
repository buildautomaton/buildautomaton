import { Bot, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '../../design/cn.js';
import { sidebarTabClass } from '../chrome.js';

export function SidebarTab({
  open,
  label,
  icon: Brand = Bot,
  onToggle,
}: {
  open: boolean;
  label: string;
  icon?: LucideIcon;
  onToggle: () => void;
}) {
  const Arrow = open ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls="ui-sidebar"
      aria-label={label}
      title={label}
      className={cn('group', sidebarTabClass, open ? 'right-[calc(26rem-1px)]' : 'right-0')}
      onClick={onToggle}
    >
      <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-md bg-zinc-950 px-2 py-1 text-xs text-white group-hover:block">
        {label}
      </span>
      <Arrow className="h-5 w-5 shrink-0" aria-hidden />
      <Brand className="h-5 w-5 shrink-0" aria-hidden />
    </button>
  );
}
