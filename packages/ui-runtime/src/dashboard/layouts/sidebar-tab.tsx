import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../design/cn.js';
import { sidebarTabClass } from '../chrome.js';

export function SidebarTab({
  open,
  label,
  onToggle,
}: {
  open: boolean;
  label: string;
  onToggle: () => void;
}) {
  const Icon = open ? ChevronRight : ChevronLeft;
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
      <Icon className="h-4 w-4" />
    </button>
  );
}
