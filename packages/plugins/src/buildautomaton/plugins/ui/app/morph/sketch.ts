import type { Point } from './project.js';

export function sketchStroke(ctx: CanvasRenderingContext2D, from: Point, to: Point, seed: number): void {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  curve(ctx, from, to, seed);
  ctx.stroke();
}

function curve(ctx: CanvasRenderingContext2D, from: Point, to: Point, seed: number): void {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const bend = wobble(seed) * Math.min(2.2, len * 0.06);
  ctx.quadraticCurveTo((from.x + to.x) / 2 + (-dy / len) * bend, (from.y + to.y) / 2 + (dx / len) * bend, to.x, to.y);
}

function wobble(seed: number): number {
  const n = Math.sin(seed * 127.1) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}
