import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function popupStyle(anchor: DOMRect, drop: 'up' | 'down', align: 'start' | 'end'): CSSProperties {
  const side = align === 'end' ? { right: window.innerWidth - anchor.right } : { left: anchor.left };
  return drop === 'up'
    ? { position: 'fixed', bottom: window.innerHeight - anchor.top + 4, ...side }
    : { position: 'fixed', top: anchor.bottom + 4, ...side };
}

export function AnchorPopup({
  open,
  anchor,
  drop = 'down',
  align = 'start',
  className,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  open: boolean;
  anchor: DOMRect | null;
  drop?: 'up' | 'down';
  align?: 'start' | 'end';
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
}) {
  if (!open || !anchor || typeof document === 'undefined') return null;
  return createPortal(
    <div
      data-ba-popup
      role="presentation"
      className={className ?? 'z-[80] min-w-[10rem] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md'}
      style={popupStyle(anchor, drop, align)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>,
    document.body,
  );
}
