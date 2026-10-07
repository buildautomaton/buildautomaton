import { CYAN, INK, NAVY, mixColor } from './color.js';
import { drawGrid, gridMetrics } from './grid.js';
import { ease } from './stages.js';

export function drawFill(ctx: CanvasRenderingContext2D, w: number, h: number, local: number, paper: string): void {
  const shift = Math.min(1, local / 0.42);
  const color = mixColor(CYAN, INK, shift);
  const background = mixColor(NAVY, paper, shift);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, w, h);
  drawGrid(ctx, w, h, color, 1, 1 - shift);
  const opened = ease(Math.min(1, Math.max(0, (local - 0.42) / 0.58)));
  punchCells(ctx, w, h, opened);
}

function punchCells(ctx: CanvasRenderingContext2D, w: number, h: number, opened: number): void {
  const { cols, rows, cw, ch } = gridMetrics(w, h);
  const span = cols + rows;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if ((col + row) / span > opened) continue;
      ctx.clearRect(col * cw, row * ch, cw, ch);
    }
  }
}
