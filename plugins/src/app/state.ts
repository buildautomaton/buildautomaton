import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type AppPhase = 'prompt' | 'transformed';

export type AppState = {
  phase: AppPhase;
  prompt: string | null;
};

const PROMPT: AppState = { phase: 'prompt', prompt: null };

export function appStateFile(cwd: string): string {
  return path.join(cwd, '.harness', 'app.json');
}

export async function readAppState(cwd: string): Promise<AppState> {
  try {
    return parseAppState(JSON.parse(await readFile(appStateFile(cwd), 'utf8')));
  } catch {
    return PROMPT;
  }
}

/** The first non-empty prompt transforms the app. Later prompts are refused. */
export async function commitAppPrompt(cwd: string, prompt: string): Promise<AppState | { error: 'empty' | 'taken' }> {
  const current = await readAppState(cwd);
  if (current.phase === 'transformed') return { error: 'taken' };
  const text = prompt.trim();
  if (!text) return { error: 'empty' };
  const next: AppState = { phase: 'transformed', prompt: text };
  const file = appStateFile(cwd);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(next, null, 2)}\n`);
  return next;
}

export function parseAppState(value: unknown): AppState {
  if (!value || typeof value !== 'object') return PROMPT;
  const record = value as { phase?: unknown; prompt?: unknown };
  if (record.phase === 'transformed' && typeof record.prompt === 'string' && record.prompt.trim()) {
    return { phase: 'transformed', prompt: record.prompt };
  }
  return PROMPT;
}
