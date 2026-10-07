import { BOX_EDGES, ENGINE_PARTS, boxCorners, type EnginePart, type Vec3 } from './engine-parts.js';
import { project, type Point } from './project.js';
import { ease } from './stages.js';

export function drawEngine(
  ctx: CanvasRenderingContext2D,
  origin: Point,
  scale: number,
  angle: number,
  orbit: number,
  alpha: number,
  color: string,
): void {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.35;
  ctx.shadowColor = 'rgba(143, 231, 255, 0.45)';
  ctx.shadowBlur = 10;
  for (const part of ENGINE_PARTS) strokePart(ctx, part, origin, scale, angle, orbit);
  drawCrank(ctx, origin, scale, angle, orbit);
  ctx.restore();
}

function strokePart(
  ctx: CanvasRenderingContext2D,
  part: EnginePart,
  origin: Point,
  scale: number,
  angle: number,
  orbit: number,
): void {
  const swap = part.at === undefined ? 0 : ease(Math.min(1, Math.max(0, (orbit - part.at) / 0.18)));
  if (swap < 1) strokeBox(ctx, part.c, part.s, origin, scale, angle, 1, swap > 0);
  if (part.next && part.nextS && swap > 0) strokeBox(ctx, part.next, part.nextS, origin, scale, angle, swap, false);
}

function strokeBox(
  ctx: CanvasRenderingContext2D,
  center: Vec3,
  size: Vec3,
  origin: Point,
  scale: number,
  angle: number,
  reveal: number,
  dashed: boolean,
): void {
  const points = boxCorners(center, size).map((corner) => project(corner, angle, origin, scale));
  const count = Math.max(1, Math.ceil(BOX_EDGES.length * reveal));
  ctx.save();
  ctx.setLineDash(dashed ? [5, 4] : []);
  ctx.beginPath();
  for (let i = 0; i < count; i += 1) {
    const edge = BOX_EDGES[i];
    if (!edge) continue;
    const [a, b] = edge;
    const from = points[a];
    const to = points[b];
    if (!from || !to) continue;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawCrank(ctx: CanvasRenderingContext2D, origin: Point, scale: number, angle: number, orbit: number): void {
  const radius = orbit > 0.5 ? 0.16 : 0.1;
  const center = project([0, -0.05, 0.55], angle, origin, scale);
  ctx.beginPath();
  ctx.ellipse(center.x, center.y, radius * scale * 0.42, radius * scale * 0.22, angle, 0, Math.PI * 2);
  ctx.stroke();
}
