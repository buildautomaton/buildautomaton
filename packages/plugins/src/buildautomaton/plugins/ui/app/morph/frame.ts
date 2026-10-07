import { CYAN, INK, NAVY, mixColor } from './color.js';
import { drawEngine } from './engine-draw.js';
import { drawFill } from './fill.js';
import { drawGrid } from './grid.js';
import { ease, morphStage, type MorphStage } from './stages.js';

export function drawMorph(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  paper: string,
): boolean {
  const { stage, local } = morphStage(t);
  ctx.clearRect(0, 0, w, h);
  if (stage === 'fill') {
    drawFill(ctx, w, h, local, paper);
    return true;
  }
  paintBackdrop(ctx, w, h, stage, local, paper);
  paintScene(ctx, w, h, stage, local);
  return false;
}

function paintBackdrop(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stage: MorphStage,
  local: number,
  paper: string,
): void {
  const schematic = stage === 'grid' ? 0 : 1;
  ctx.save();
  ctx.globalAlpha = stage === 'grid' ? ease(local) : 1;
  ctx.fillStyle = mixColor(paper, NAVY, schematic === 0 ? 0 : stage === 'schematic' ? local : 1);
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function paintScene(ctx: CanvasRenderingContext2D, w: number, h: number, stage: MorphStage, local: number): void {
  const origin = { x: w / 2, y: h / 2 };
  if (stage === 'grid') drawGrid(ctx, w, h, INK, ease(local), 0);
  if (stage === 'schematic') drawGrid(ctx, w, h, mixColor(INK, CYAN, local), 1, ease(local));
  if (stage === 'engine') drawCollapsing(ctx, w, h, origin, local);
  if (stage === 'orbit') drawOrbit(ctx, w, h, origin, local);
  if (stage === 'rematerialize') drawReturn(ctx, w, h, origin, local);
}

function drawCollapsing(ctx: CanvasRenderingContext2D, w: number, h: number, origin: { x: number; y: number }, local: number): void {
  const zoom = 1 - ease(local) * 0.62;
  ctx.save();
  ctx.translate(origin.x, origin.y);
  ctx.scale(zoom, zoom);
  ctx.translate(-origin.x, -origin.y);
  ctx.globalAlpha = 1 - ease(local) * 0.82;
  drawGrid(ctx, w, h, CYAN, 1, 1);
  ctx.restore();
  drawEngine(ctx, origin, 70 + ease(local) * 90, -0.45, 0, ease(local), CYAN);
}

function drawOrbit(ctx: CanvasRenderingContext2D, w: number, h: number, origin: { x: number; y: number }, local: number): void {
  ctx.save();
  ctx.globalAlpha = 0.18;
  drawGrid(ctx, w, h, CYAN, 1, 0.4);
  ctx.restore();
  const angle = -0.45 + ease(local) * 1.65;
  drawEngine(ctx, origin, 160, angle, local, 1, CYAN);
}

function drawReturn(ctx: CanvasRenderingContext2D, w: number, h: number, origin: { x: number; y: number }, local: number): void {
  const spread = 0.34 + ease(local) * 0.66;
  ctx.save();
  ctx.translate(origin.x, origin.y);
  ctx.scale(spread, spread);
  ctx.translate(-origin.x, -origin.y);
  ctx.globalAlpha = ease(local);
  drawGrid(ctx, w, h, CYAN, 1, 1);
  ctx.restore();
  drawEngine(ctx, origin, 160 + ease(local) * 120, 1.2, 1, 1 - ease(local), CYAN);
}
