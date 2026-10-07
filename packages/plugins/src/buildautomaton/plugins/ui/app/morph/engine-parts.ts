export type Vec3 = readonly [number, number, number];

export type EnginePart = {
  id: string;
  c: Vec3;
  s: Vec3;
  next?: Vec3;
  nextS?: Vec3;
  at?: number;
};

export const ENGINE_PARTS: EnginePart[] = [
  { id: 'block', c: [0, 0.05, 0], s: [1.7, 1.05, 1.05] },
  { id: 'head', c: [0, 0.74, 0], s: [1.55, 0.32, 0.92], next: [0, 0.86, 0], nextS: [1.62, 0.5, 0.98], at: 0.22 },
  { id: 'pan', c: [0, -0.66, 0], s: [1.32, 0.22, 0.8], next: [0, -0.76, 0], nextS: [1.18, 0.4, 0.88], at: 0.46 },
  {
    id: 'manifold',
    c: [-1.08, 0.16, 0],
    s: [0.24, 0.7, 0.5],
    next: [1.14, 0.22, 0.12],
    nextS: [0.46, 0.46, 0.46],
    at: 0.7,
  },
];

const CORNERS: Vec3[] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

export const BOX_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

export function boxCorners(center: Vec3, size: Vec3): Vec3[] {
  return CORNERS.map(([x, y, z]) => [
    center[0] + x * size[0] * 0.5,
    center[1] + y * size[1] * 0.5,
    center[2] + z * size[2] * 0.5,
  ]);
}
