import { useEffect, useState } from 'react';
import type { GitContext } from '@plugins/git/types.js';
import { loadGitContext } from './load-git.js';

export function useGit() {
  const [git, setGit] = useState<GitContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let stop = false;
    loadGitContext()
      .then((next) => {
        if (!stop) setGit(next);
      })
      .catch((err: unknown) => {
        if (!stop) setError(err instanceof Error ? err.message : 'Could not read git');
      });
    return () => {
      stop = true;
    };
  }, []);
  return { git, error };
}
