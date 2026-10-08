import { mixColor, type Marker } from './color.js';
import { drawGrid, gridMetrics } from './grid.js';
import { SLICES, STACKS } from './sphere.js';
import { ease } from './stages.js';

export function drawFill(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  local: number,
  paper: string,
  marker: Marker,
): void {
  const shift = Math.min(1, local / 0.42);
  ctx.fillStyle = mixColor(marker.board, paper, shift);
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.globalAlpha = 1 - shift;
  drawGrid(ctx, w, h, marker.ink, 1, SLICES, STACKS);
  ctx.restore();
  const opened = ease(Math.min(1, Math.max(0, (local - 0.42) / 0.58)));
  punchCells(ctx, w, h, opened);
}

function punchCells(ctx: CanvasRenderingContext2D, w: number, h: number, opened: number): void {
  const { cols, rows, cw, ch } = gridMetrics(w, h, SLICES, STACKS);
  const span = cols + rows;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if ((col + row) / span > opened) continue;
      ctx.clearRect(col * cw, row * ch, cw, ch);
    }
  }
}
