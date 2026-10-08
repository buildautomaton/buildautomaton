export type Cell = { index: number; x: number; y: number; w: number; h: number };

/** One viewport tile per sphere face, in the same row-major order. */
export function unfurledCells(count: number, slices: number, w: number, h: number): Cell[] {
  const stacks = Math.max(1, Math.ceil(count / slices));
  const cw = w / slices;
  const ch = h / stacks;
  return Array.from({ length: count }, (_, index) => {
    const slice = index % slices;
    const stack = Math.floor(index / slices);
    return { index, x: slice * cw, y: stack * ch, w: cw, h: ch };
  });
}

let cachedW = -1;
let cachedH = -1;
let cached: Cell[] = [];

export function tileCells(count: number, slices: number, w: number, h: number): Cell[] {
  if (cachedW === w && cachedH === h && cached.length === count) return cached;
  cachedW = w;
  cachedH = h;
  cached = unfurledCells(count, slices, w, h);
  return cached;
}
