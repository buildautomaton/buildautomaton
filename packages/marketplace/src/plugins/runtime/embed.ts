export const EMBED_DIM = 256;

export function tokenize(text: string): string[] {
  const lower = text.toLowerCase();
  const words = lower.split(/[^a-z0-9]+/).filter((word) => word.length > 1);
  const compact = lower.replace(/[^a-z0-9]+/g, ' ');
  const grams: string[] = [];
  for (let i = 0; i < compact.length - 2; i += 1) grams.push(compact.slice(i, i + 3));
  return [...words, ...grams];
}

function hashToken(token: string): number {
  let hash = 2166136261;
  for (let i = 0; i < token.length; i += 1) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % EMBED_DIM;
}

export function embed(text: string): number[] {
  const vector = new Array<number>(EMBED_DIM).fill(0);
  for (const token of tokenize(text)) vector[hashToken(token)] += 1;
  return normalize(vector);
}

export function cosine(left: number[], right: number[]): number {
  let dot = 0;
  for (let i = 0; i < EMBED_DIM; i += 1) dot += (left[i] ?? 0) * (right[i] ?? 0);
  return dot;
}

function normalize(vector: number[]): number[] {
  const length = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (length === 0) return vector;
  return vector.map((value) => value / length);
}
