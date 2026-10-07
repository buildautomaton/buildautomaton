export const MORPH_MS = 8400;

export const MORPH_STAGES = ['grid', 'schematic', 'engine', 'orbit', 'rematerialize', 'fill'] as const;

export type MorphStage = (typeof MORPH_STAGES)[number];

const ENDS = [0.16, 0.32, 0.5, 0.72, 0.86, 1];

export function morphStage(t: number): { stage: MorphStage; local: number } {
  const clamped = Math.min(1, Math.max(0, t));
  let start = 0;
  for (let i = 0; i < ENDS.length; i += 1) {
    const end = ENDS[i] ?? 1;
    if (clamped <= end || i === ENDS.length - 1) {
      return { stage: MORPH_STAGES[i] ?? 'fill', local: (clamped - start) / (end - start) };
    }
    start = end;
  }
  return { stage: 'fill', local: 1 };
}

export function ease(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}
