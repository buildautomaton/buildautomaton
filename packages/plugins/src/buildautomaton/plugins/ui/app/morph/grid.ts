export type Grid = { cols: number; rows: number; cw: number; ch: number };

export function gridMetrics(w: number, h: number): Grid {
  const cols = Math.max(4, Math.round(w / 56));
  const rows = Math.max(4, Math.round(h / 56));
  return { cols, rows, cw: w / cols, ch: h / rows };
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  progress: number,
  ticks: number,
): Grid {
  const metrics = gridMetrics(w, h);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  strokeLines(ctx, metrics, w, h, progress);
  ctx.stroke();
  if (ticks > 0) drawMarks(ctx, metrics, w, h, color, ticks);
  return metrics;
}

function strokeLines(ctx: CanvasRenderingContext2D, grid: Grid, w: number, h: number, progress: number): void {
  for (let col = 0; col <= grid.cols; col += 1) {
    const drawn = Math.min(1, Math.max(0, progress * 1.35 - (col / grid.cols) * 0.35));
    ctx.moveTo(col * grid.cw, 0);
    ctx.lineTo(col * grid.cw, h * drawn);
  }
  for (let row = 0; row <= grid.rows; row += 1) {
    const drawn = Math.min(1, Math.max(0, (progress - 0.22) * 1.45 - (row / grid.rows) * 0.28));
    ctx.moveTo(0, row * grid.ch);
    ctx.lineTo(w * Math.max(0, drawn), row * grid.ch);
  }
}

function drawMarks(ctx: CanvasRenderingContext2D, grid: Grid, w: number, h: number, color: string, ticks: number): void {
  ctx.save();
  ctx.globalAlpha *= ticks;
  ctx.strokeStyle = color;
  ctx.strokeRect(18, 18, w - 36, h - 36);
  ctx.beginPath();
  for (let col = 1; col < grid.cols; col += 2) {
    for (let row = 1; row < grid.rows; row += 2) {
      const x = col * grid.cw;
      const y = row * grid.ch;
      ctx.moveTo(x - 4, y);
      ctx.lineTo(x + 4, y);
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x, y + 4);
    }
  }
  ctx.stroke();
  ctx.restore();
}
