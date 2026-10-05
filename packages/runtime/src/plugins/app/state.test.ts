import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { commitAppPrompt, readAppState } from './state.js';

describe('app state', () => {
  it('starts as a prompt and keeps the first prompt', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'app-state-'));
    expect(await readAppState(cwd)).toEqual({ phase: 'prompt', prompt: null });
    expect(await commitAppPrompt(cwd, '  A reading list  ')).toEqual({
      phase: 'transformed',
      prompt: 'A reading list',
    });
    expect(await readAppState(cwd)).toEqual({ phase: 'transformed', prompt: 'A reading list' });
    expect(await commitAppPrompt(cwd, 'something else')).toEqual({ error: 'taken' });
    expect(await readAppState(cwd)).toEqual({ phase: 'transformed', prompt: 'A reading list' });
  });

  it('rejects an empty prompt', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'app-state-'));
    expect(await commitAppPrompt(cwd, '   ')).toEqual({ error: 'empty' });
    expect(await readAppState(cwd)).toEqual({ phase: 'prompt', prompt: null });
  });
});
