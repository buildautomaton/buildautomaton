import { useState, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@buildautomaton/ui-runtime';

export function ActivityCollapse({
  title,
  trailing,
  children,
  defaultOpen = false,
}: {
  title: string;
  trailing?: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details className="my-3" open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className="flex cursor-pointer list-none items-center gap-1.5 py-1 text-sm font-medium text-muted-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        <ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-90')} aria-hidden />
        <span className="min-w-0 flex-1 truncate">{title}</span>
        {trailing}
      </summary>
      {open && children ? <div className="pb-1 pl-5 pt-1">{children}</div> : null}
    </details>
  );
}
