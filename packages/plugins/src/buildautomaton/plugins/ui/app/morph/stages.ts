export const MORPH_MS = 8200;

export const MORPH_STAGES = ['grid', 'assemble', 'rotate', 'unfurl', 'fill'] as const;

export type MorphStage = (typeof MORPH_STAGES)[number];

const ENDS = [0.0507, 0.2537, 0.6956, 0.8605, 1];

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
  return 1 - (1 - x) ** 3;
}
