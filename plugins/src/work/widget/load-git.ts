import type { GitContext } from '@plugins/git/types.js';

const TTL_MS = 10_000;
let cached: { at: number; value: GitContext } | null = null;

export async function loadGitContext(): Promise<GitContext> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;
  const res = await fetch('/api/git');
  if (!res.ok) throw new Error('Could not read the working directory');
  const value = (await res.json()) as GitContext;
  cached = { at: Date.now(), value };
  return value;
}
