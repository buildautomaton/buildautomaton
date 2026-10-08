export type Vec3 = readonly [number, number, number];

export type Point = { x: number; y: number };

/** Three-quarter of the crown, tipped enough that a side of the sphere reads. */
const PITCH = -0.62;
const PITCH_COS = Math.cos(PITCH);
const PITCH_SIN = Math.sin(PITCH);
const CAMERA = 5.4;

export function writeProjected(
  x: number,
  y: number,
  z: number,
  yawSin: number,
  yawCos: number,
  ox: number,
  oy: number,
  scale: number,
  buf: Float32Array,
  offset: number,
): number {
  const x1 = x * yawCos - z * yawSin;
  const z1 = x * yawSin + z * yawCos;
  const y2 = y * PITCH_COS - z1 * PITCH_SIN;
  const z2 = y * PITCH_SIN + z1 * PITCH_COS;
  const depth = CAMERA / (CAMERA + z2);
  buf[offset] = ox + x1 * scale * depth;
  buf[offset + 1] = oy - y2 * scale * depth;
  return z2;
}
