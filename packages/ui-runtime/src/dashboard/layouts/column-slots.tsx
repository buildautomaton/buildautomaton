import { useLayoutEffect, useRef, useState } from 'react';
import { useUiHost } from '../host.js';
import { columnPaneClass } from '../chrome.js';
import { SplitColumns } from './split-columns.js';
import { focusedPanes } from './focused-panes.js';

const MIN = 240;

export function ColumnSlots() {
  const { surfacesIn, focusedColumnId } = useUiHost();
  const columns = surfacesIn('column');
  const panes = focusedPanes(columns, focusedColumnId);
  const focused = focusedColumnId != null && panes.length === 1;
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || panes.length === 0) return;
    setWidth(Math.max(MIN, Math.floor(el.getBoundingClientRect().width / panes.length)));
  }, [panes.length, focused]);

  const board = width != null ? <SplitColumns panes={panes} defaultWidth={width} /> : null;

  return (
    <div
      ref={ref}
      className={
        focused
          ? 'flex min-h-0 min-w-0 flex-1 justify-center overflow-hidden'
          : 'min-h-0 min-w-0 flex-1 overflow-hidden'
      }
    >
      {focused ? <div className={`${columnPaneClass} w-full max-w-2xl border-x border-border`}>{board}</div> : board}
    </div>
  );
}
