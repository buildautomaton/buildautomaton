import type { Marker } from './color.js';
import { paintMesh } from './draw.js';
import { serial, sphereAngle, spinLife, unfurl } from './pose.js';
import { FACE_COUNT } from './sphere.js';
import { drawStatus } from './status.js';

export function drawAssemble(ctx: CanvasRenderingContext2D, w: number, h: number, local: number, marker: Marker): void {
  paintMesh(ctx, w, h, marker, sphereAngle('assemble', local), (index) => serial(index, FACE_COUNT, local));
}

export function drawSpin(ctx: CanvasRenderingContext2D, w: number, h: number, local: number, marker: Marker): void {
  const life = spinLife(local);
  paintMesh(ctx, w, h, marker, sphereAngle('rotate', local), () => 1, life.scale, life.warmth);
  drawStatus(ctx, w, h, marker, local);
}

export function drawUnfurl(ctx: CanvasRenderingContext2D, w: number, h: number, local: number, marker: Marker): void {
  paintMesh(ctx, w, h, marker, sphereAngle('unfurl', local), (index) => 1 - unfurl(index, FACE_COUNT, local));
}
