import { execGitFile } from './exec.js';

/** Branch name, or null when detached (`HEAD`) or empty. */
export function branchName(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'HEAD') return null;
  return trimmed;
}

/** Current branch, or null when detached / unavailable. */
export async function getCurrentBranch(repoPath: string): Promise<string | null> {
  try {
    const { stdout } = await execGitFile(['symbolic-ref', '--short', 'HEAD'], { cwd: repoPath });
    return branchName(stdout);
  } catch {
    return null;
  }
}
