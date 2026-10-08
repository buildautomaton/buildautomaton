import { access } from 'node:fs/promises';
import path from 'node:path';

/** True when `dirPath` itself contains a `.git` file or directory. */
export async function isGitRepoDirectory(dirPath: string): Promise<boolean> {
  try {
    await access(path.join(dirPath, '.git'));
    return true;
  } catch {
    return false;
  }
}
