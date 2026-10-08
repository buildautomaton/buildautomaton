import { describe, expect, it } from 'vitest';
import { focusedPanes } from './focused-panes.js';
import type { UiSurface } from '../../core/plugin.js';

const pane = (id: string): UiSurface => ({
  id,
  title: id,
  panel: 'column',
  component: () => null,
});

describe('focusedPanes', () => {
  const columns = [pane('a'), pane('b'), pane('c')];

  it('returns all columns when nothing is focused', () => {
    expect(focusedPanes(columns, null)).toEqual(columns);
  });

  it('returns only the focused column when present', () => {
    expect(focusedPanes(columns, 'b')).toEqual([columns[1]]);
  });

  it('falls back to all columns when the id is missing', () => {
    expect(focusedPanes(columns, 'missing')).toEqual(columns);
  });
});
