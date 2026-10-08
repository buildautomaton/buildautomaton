import path from 'node:path';
import { branchName } from './branch.js';
import { execGitFile } from './exec.js';
import type { GitContext } from './types.js';

const TTL_MS = 10_000;
const byDir = new Map<string, { at: number; value: GitContext }>();

export function clearGitContextCache(): void {
  byDir.clear();
}

export function gitContextCacheSize(): number {
  return byDir.size;
}

/** Repo root and branch in parallel. Repeat reads within 10s skip git. */
export async function readGitContext(cwd: string): Promise<GitContext> {
  const key = path.resolve(cwd);
  const hit = byDir.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value;
  const value = await probe(key);
  byDir.set(key, { at: Date.now(), value });
  return value;
}

async function probe(cwd: string): Promise<GitContext> {
  try {
    const [{ stdout }, branch] = await Promise.all([
      execGitFile(['rev-parse', '--is-inside-work-tree', '--show-toplevel'], { cwd }),
      execGitFile(['symbolic-ref', '--short', 'HEAD'], { cwd }).catch(() => null),
    ]);
    const [inside, top] = stdout.split(/\r?\n/);
    if (inside?.trim() !== 'true' || !top?.trim()) return outside(cwd);
    return { cwd, inRepo: true, repo: path.resolve(top.trim()), branch: branchName(branch?.stdout ?? '') };
  } catch {
    return outside(cwd);
  }
}

function outside(cwd: string): GitContext {
  return { cwd, inRepo: false, repo: null, branch: null };
}
