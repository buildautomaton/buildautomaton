import type { Vec3 } from './engine-parts.js';

export type Point = { x: number; y: number };

export function project(point: Vec3, angle: number, origin: Point, scale: number): Point {
  const [x, y, z] = point;
  const xr = x * Math.cos(angle) - z * Math.sin(angle);
  const zr = x * Math.sin(angle) + z * Math.cos(angle);
  const depth = 1 / (2.35 + zr * 0.38);
  return { x: origin.x + xr * scale * depth, y: origin.y - y * scale * depth + zr * scale * 0.05 };
}
