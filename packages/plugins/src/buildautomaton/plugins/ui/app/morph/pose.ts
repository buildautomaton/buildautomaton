import { ease } from './stages.js';

export const ASSEMBLED_ANGLE = 0.72;
export const SPIN = 0.36;

/** Two slow breaths of size and warmth across the spin. */
export function spinLife(local: number): { scale: number; warmth: number } {
  const wave = Math.sin(local * Math.PI * 9);
  return { scale: 1 + wave * 0.055, warmth: 0.5 + wave * 0.5 };
}

export function sphereAngle(kind: 'assemble' | 'rotate' | 'unfurl', local: number): number {
  if (kind === 'assemble') return ease(local) * ASSEMBLED_ANGLE;
  if (kind === 'rotate') return ASSEMBLED_ANGLE + local * SPIN;
  return ASSEMBLED_ANGLE + SPIN;
}

/** Pieces overlap so the grid folds in one quick wave. */
export function serial(index: number, count: number, local: number): number {
  const span = 0.62;
  const start = (index / Math.max(1, count)) * (1 - span);
  return ease(clamp((local - start) / span));
}

/** The last face to land is the first to fold back into its tile. */
export function unfurl(index: number, count: number, local: number): number {
  return serial(count - 1 - index, count, local);
}

function clamp(t: number): number {
  return Math.min(1, Math.max(0, t));
}
