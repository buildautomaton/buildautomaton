import type { Cell } from './cells.js';
import { writeProjected } from './project.js';
import { FACE_COUNT, FACE_XYZ } from './sphere.js';

export const XY = new Float32Array(FACE_COUNT * 8);

export function layFace(
  index: number,
  placed: number,
  cell: Cell,
  yawSin: number,
  yawCos: number,
  ox: number,
  oy: number,
  scale: number,
): number {
  const dst = index * 8;
  const x0 = cell.x;
  const y0 = cell.y;
  const x1 = cell.x + cell.w;
  const y1 = cell.y + cell.h;
  if (placed <= 0) {
    writeFlat(dst, x0, y0, x1, y1);
    return 0;
  }
  const src = index * 12;
  const z =
    corner(src, dst, placed, x0, y0, yawSin, yawCos, ox, oy, scale) +
    corner(src + 3, dst + 2, placed, x1, y0, yawSin, yawCos, ox, oy, scale) +
    corner(src + 6, dst + 4, placed, x1, y1, yawSin, yawCos, ox, oy, scale) +
    corner(src + 9, dst + 6, placed, x0, y1, yawSin, yawCos, ox, oy, scale);
  return z / 4;
}

export function facingAway(index: number): boolean {
  const o = index * 8;
  const x0 = XY[o] ?? 0;
  const y0 = XY[o + 1] ?? 0;
  const x1 = XY[o + 2] ?? 0;
  const y1 = XY[o + 3] ?? 0;
  const x2 = XY[o + 4] ?? 0;
  const y2 = XY[o + 5] ?? 0;
  return (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0) < 0;
}

function writeFlat(dst: number, x0: number, y0: number, x1: number, y1: number): void {
  XY[dst] = x0;
  XY[dst + 1] = y0;
  XY[dst + 2] = x1;
  XY[dst + 3] = y0;
  XY[dst + 4] = x1;
  XY[dst + 5] = y1;
  XY[dst + 6] = x0;
  XY[dst + 7] = y1;
}

function corner(
  src: number,
  dst: number,
  placed: number,
  fx: number,
  fy: number,
  yawSin: number,
  yawCos: number,
  ox: number,
  oy: number,
  scale: number,
): number {
  const z = writeProjected(
    FACE_XYZ[src] ?? 0,
    FACE_XYZ[src + 1] ?? 0,
    FACE_XYZ[src + 2] ?? 0,
    yawSin,
    yawCos,
    ox,
    oy,
    scale,
    XY,
    dst,
  );
  if (placed < 1) {
    XY[dst] = fx + ((XY[dst] ?? fx) - fx) * placed;
    XY[dst + 1] = fy + ((XY[dst + 1] ?? fy) - fy) * placed;
  }
  return z;
}
