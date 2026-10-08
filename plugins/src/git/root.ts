import path from 'node:path';
import { execGitFileSync } from './exec.js';
import { lookupRoot, rememberRoot } from './root-cache.js';

export {
  clearGitRepoRootSyncCache,
  clearGitRepoRootSyncCacheMaxForTests,
  gitRepoRootSyncCacheSize,
  setGitRepoRootSyncCacheMaxForTests,
} from './root-cache.js';

const GIT_LOOKUP_TIMEOUT_MS = 2_000;

/**
 * Git repo root for `startDir`, cached per resolved path (LRU).
 * A package directory resolves to the monorepo root without spawning git again.
 */
export function getGitRepoRootSync(startDir: string): string | null {
  const key = path.resolve(startDir);
  const hit = lookupRoot(key);
  if (hit !== undefined) return rememberRoot(key, hit);
  try {
    const out = execGitFileSync(['rev-parse', '--show-toplevel'], {
      cwd: key,
      timeout: GIT_LOOKUP_TIMEOUT_MS,
    }).trim();
    return rememberRoot(key, out ? path.resolve(out) : null);
  } catch {
    return rememberRoot(key, null);
  }
}
