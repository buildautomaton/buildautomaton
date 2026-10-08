import type { UiSurface } from '../../core/plugin.js';

/** When a column is focused, return only that pane; otherwise all columns. */
export function focusedPanes(columns: UiSurface[], focusedColumnId: string | null): UiSurface[] {
  if (!focusedColumnId) return columns;
  const focused = columns.find((column) => column.id === focusedColumnId);
  return focused ? [focused] : columns;
}
