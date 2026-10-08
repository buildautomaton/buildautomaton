import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const GIT_SYNC_STDIO = ['ignore', 'pipe', 'pipe'] as ['ignore', 'pipe', 'pipe'];

/** Sync git stdout. Stderr is piped so fatals stay off the terminal. */
export function execGitFileSync(args: string[], options: { cwd: string; timeout?: number }): string {
  return execFileSync('git', args, {
    cwd: options.cwd,
    timeout: options.timeout ?? 2_000,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
    stdio: GIT_SYNC_STDIO,
  });
}

export async function execGitFile(
  args: string[],
  options: { cwd: string; timeout?: number },
): Promise<{ stdout: string; stderr: string }> {
  const result = await execFileAsync('git', args, {
    cwd: options.cwd,
    timeout: options.timeout ?? 2_000,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
    windowsHide: true,
  });
  return { stdout: String(result.stdout ?? ''), stderr: String(result.stderr ?? '') };
}
