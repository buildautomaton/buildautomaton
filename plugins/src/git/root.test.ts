import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import {
  clearGitRepoRootSyncCache,
  clearGitRepoRootSyncCacheMaxForTests,
  getGitRepoRootSync,
  gitRepoRootSyncCacheSize,
  setGitRepoRootSyncCacheMaxForTests,
} from './root.js';

describe('getGitRepoRootSync cache', () => {
  beforeEach(() => {
    clearGitRepoRootSyncCache();
    setGitRepoRootSyncCacheMaxForTests(3);
  });

  afterEach(() => {
    clearGitRepoRootSyncCache();
    clearGitRepoRootSyncCacheMaxForTests();
  });

  it('evicts oldest entries when over the max', () => {
    for (let i = 0; i < 5; i++) getGitRepoRootSync(`/nonexistent-git-root-cache-${i}`);
    expect(gitRepoRootSyncCacheSize()).toBe(3);
  });
});
