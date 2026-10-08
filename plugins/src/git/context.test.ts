import { realpathSync } from 'node:fs';
import path from 'node:path';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { clearGitContextCache, readGitContext } from './context.js';

describe('readGitContext', () => {
  afterEach(() => {
    clearGitContextCache();
  });

  it('reports a repo root and branch from one lookup', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'git-ctx-'));
    execFileSync('git', ['init', '-b', 'demo', '--template='], { cwd });
    const child = path.join(cwd, 'pkg');
    await mkdir(child);
    const ctx = await readGitContext(child);
    expect(ctx.inRepo).toBe(true);
    expect(ctx.repo).toBe(realpathSync(cwd));
    expect(ctx.branch).toBe('demo');
    await rm(cwd, { recursive: true, force: true });
  });

  it('reuses the cached context until cleared', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'git-cache-'));
    execFileSync('git', ['init', '-b', 'demo', '--template='], { cwd });
    expect((await readGitContext(cwd)).inRepo).toBe(true);
    await rm(path.join(cwd, '.git'), { recursive: true, force: true });
    expect((await readGitContext(cwd)).inRepo).toBe(true);
    clearGitContextCache();
    expect((await readGitContext(cwd)).inRepo).toBe(false);
    await rm(cwd, { recursive: true, force: true });
  });

  it('reports a directory that is not a repository', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'git-none-'));
    expect(await readGitContext(cwd)).toMatchObject({ inRepo: false, repo: null, branch: null });
    await rm(cwd, { recursive: true, force: true });
  });
});
