import { tileCells } from './cells.js';
import type { Marker } from './color.js';
import { facingAway, layFace, XY } from './place.js';
import { FACE_COUNT, SLICES, sphereFaces } from './sphere.js';
import { rampAt } from './tones.js';

sphereFaces();

const DEPTH = new Float32Array(FACE_COUNT);
const PLACED = new Float32Array(FACE_COUNT);
const ORDER = Array.from({ length: FACE_COUNT }, (_, index) => index);

export function paintMesh(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  marker: Marker,
  angle: number,
  placedFor: (index: number) => number,
  scalePulse = 1,
  warmth = 0.5,
): void {
  const cells = tileCells(FACE_COUNT, SLICES, w, h);
  const yawSin = Math.sin(angle);
  const yawCos = Math.cos(angle);
  const ox = w / 2;
  const oy = h / 2;
  const scale = Math.min(w, h) * 0.23 * scalePulse;
  const ramp = rampAt(marker, warmth);
  for (let index = 0; index < FACE_COUNT; index += 1) {
    const placed = placedFor(index);
    PLACED[index] = placed;
    DEPTH[index] = layFace(index, placed, cells[index]!, yawSin, yawCos, ox, oy, scale);
  }
  ORDER.sort(fartherFirst);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1.05;
  ctx.strokeStyle = marker.ink;
  let fill = '';
  for (const index of ORDER) {
    if (PLACED[index]! > 0.92 && facingAway(index)) continue;
    const next = ramp[shadeIndex(DEPTH[index]!, PLACED[index]!)] ?? ramp[0]!;
    if (next !== fill) {
      fill = next;
      ctx.fillStyle = fill;
    }
    trace(ctx, index);
  }
}

function fartherFirst(a: number, b: number): number {
  const lift = Number(PLACED[a]! > 0.02) - Number(PLACED[b]! > 0.02);
  return lift === 0 ? DEPTH[b]! - DEPTH[a]! : lift;
}

function shadeIndex(z: number, placed: number): number {
  if (placed < 0.02) return 0;
  return Math.min(7, Math.max(0, Math.round(((z + 1) / 2) * 7)));
}

function trace(ctx: CanvasRenderingContext2D, index: number): void {
  const o = index * 8;
  ctx.beginPath();
  ctx.moveTo(XY[o] ?? 0, XY[o + 1] ?? 0);
  ctx.lineTo(XY[o + 2] ?? 0, XY[o + 3] ?? 0);
  ctx.lineTo(XY[o + 4] ?? 0, XY[o + 5] ?? 0);
  ctx.lineTo(XY[o + 6] ?? 0, XY[o + 7] ?? 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

