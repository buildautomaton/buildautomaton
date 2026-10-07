import { sketchStroke } from './sketch.js';

export type Grid = { cols: number; rows: number; cw: number; ch: number };

export function gridMetrics(w: number, h: number, cols = 0, rows = 0): Grid {
  const usedCols = cols > 0 ? cols : Math.max(4, Math.round(w / 56));
  const usedRows = rows > 0 ? rows : Math.max(4, Math.round(h / 56));
  return { cols: usedCols, rows: usedRows, cw: w / usedCols, ch: h / usedRows };
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  progress: number,
  cols = 0,
  rows = 0,
): Grid {
  const metrics = gridMetrics(w, h, cols, rows);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.15;
  ctx.lineCap = 'round';
  strokeLines(ctx, metrics, w, h, progress);
  ctx.restore();
  return metrics;
}

function strokeLines(ctx: CanvasRenderingContext2D, grid: Grid, w: number, h: number, progress: number): void {
  for (let col = 0; col <= grid.cols; col += 1) {
    const drawn = Math.min(1, Math.max(0, progress * 1.35 - (col / grid.cols) * 0.35));
    if (drawn <= 0) continue;
    sketchStroke(ctx, { x: col * grid.cw, y: 0 }, { x: col * grid.cw, y: h * drawn }, col * 19 + 3);
  }
  for (let row = 0; row <= grid.rows; row += 1) {
    const drawn = Math.min(1, Math.max(0, (progress - 0.22) * 1.45 - (row / grid.rows) * 0.28));
    if (drawn <= 0) continue;
    sketchStroke(ctx, { x: 0, y: row * grid.ch }, { x: w * drawn, y: row * grid.ch }, row * 23 + 11);
  }
}
