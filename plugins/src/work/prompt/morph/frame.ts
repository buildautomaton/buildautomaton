import { markerFor, mixColor, type Marker } from './color.js';
import { drawFill } from './fill.js';
import { drawGrid } from './grid.js';
import { drawAssemble, drawSpin, drawUnfurl } from './scene.js';
import { SLICES, STACKS } from './sphere.js';
import { ease, morphStage, type MorphStage } from './stages.js';

export function drawMorph(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  paper: string,
  dark = false,
): boolean {
  const { stage, local } = morphStage(t);
  const marker = markerFor(dark);
  ctx.clearRect(0, 0, w, h);
  if (stage === 'fill') {
    drawFill(ctx, w, h, local, paper, marker);
    return true;
  }
  paintBackdrop(ctx, w, h, stage, local, paper, marker);
  paintScene(ctx, w, h, stage, local, marker);
  return false;
}

function paintBackdrop(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stage: MorphStage,
  local: number,
  paper: string,
  marker: Marker,
): void {
  ctx.fillStyle = mixColor(paper, marker.board, stage === 'grid' ? local : 1);
  ctx.fillRect(0, 0, w, h);
}

function paintScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stage: MorphStage,
  local: number,
  marker: Marker,
): void {
  if (stage === 'grid') drawGrid(ctx, w, h, marker.ink, ease(local), SLICES, STACKS);
  if (stage === 'assemble') drawAssemble(ctx, w, h, local, marker);
  if (stage === 'rotate') drawSpin(ctx, w, h, local, marker);
  if (stage === 'unfurl') drawUnfurl(ctx, w, h, local, marker);
}
