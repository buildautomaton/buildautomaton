/** Hard cap so a long-lived host does not retain unbounded cwd to root mappings. */
export const GIT_REPO_ROOT_SYNC_CACHE_MAX = 1_000;

const rootByStartDir = new Map<string, string | null>();
let cacheMax = GIT_REPO_ROOT_SYNC_CACHE_MAX;

export function lookupRoot(key: string): string | null | undefined {
  return rootByStartDir.has(key) ? rootByStartDir.get(key)! : undefined;
}

/** LRU touch: reinsert so the oldest key is evicted first. */
export function rememberRoot(key: string, root: string | null): string | null {
  if (rootByStartDir.has(key)) rootByStartDir.delete(key);
  rootByStartDir.set(key, root);
  while (rootByStartDir.size > cacheMax) {
    const oldest = rootByStartDir.keys().next().value;
    if (oldest === undefined) break;
    rootByStartDir.delete(oldest);
  }
  return root;
}

export function clearGitRepoRootSyncCache(): void {
  rootByStartDir.clear();
}

export function setGitRepoRootSyncCacheMaxForTests(max: number): void {
  cacheMax = max;
}

export function clearGitRepoRootSyncCacheMaxForTests(): void {
  cacheMax = GIT_REPO_ROOT_SYNC_CACHE_MAX;
}

export function gitRepoRootSyncCacheSize(): number {
  return rootByStartDir.size;
}
