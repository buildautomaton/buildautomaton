import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { isShutdownRequested } from '@plugins/harnesses/acp/util/shutdown.js';
import { agentPathEnv, getAgentPathEntries } from './agent-path.js';
import { forgetPresence, readPresence, writePresence } from './presence-cache.js';

const execFileAsync = promisify(execFile);

export const COMMAND_ON_PATH_PROBE_TIMEOUT_MS = 750;

async function execFileShutdownAware(file: string, args: readonly string[], timeoutMs: number): Promise<void> {
  if (isShutdownRequested()) throw new Error('shutdown');
  const ac = new AbortController();
  const shutdownPoll = setInterval(() => {
    if (isShutdownRequested()) ac.abort();
  }, 50);
  shutdownPoll.unref?.();
  try {
    await execFileAsync(file, args, { timeout: timeoutMs, signal: ac.signal });
  } finally {
    clearInterval(shutdownPoll);
  }
}

async function isExecutableFile(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function isCommandInBridgeAgentDirs(command: string): Promise<boolean> {
  const home = process.env.HOME ?? homedir();
  for (const dir of getAgentPathEntries(home)) {
    if (await isExecutableFile(join(dir, command))) return true;
  }
  return false;
}

/** Known install dirs first, then `which`. Results are cached so repeat opens stay instant. */
export async function isCommandOnPath(
  command: string,
  timeoutMs = COMMAND_ON_PATH_PROBE_TIMEOUT_MS,
): Promise<boolean> {
  if (isShutdownRequested()) return false;
  const cached = readPresence(command);
  if (cached !== undefined) return cached;
  const found = (await isCommandInBridgeAgentDirs(command)) || (await whichCommand(command, timeoutMs));
  writePresence(command, found);
  return found;
}

function whichCommand(command: string, timeoutMs: number): Promise<boolean> {
  return execFileAsync('which', [command], { timeout: timeoutMs, env: agentPathEnv() }).then(
    () => true,
    () => false,
  );
}

export async function waitForCommandOnPath(
  command: string,
  opts: { maxAttempts?: number; delayMs?: number; timeoutMs?: number } = {},
): Promise<boolean> {
  const maxAttempts = opts.maxAttempts ?? 8;
  const delayMs = opts.delayMs ?? 400;
  const timeoutMs = opts.timeoutMs ?? COMMAND_ON_PATH_PROBE_TIMEOUT_MS;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    forgetPresence(command);
    if (await isCommandOnPath(command, timeoutMs)) return true;
    if (attempt < maxAttempts - 1) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

export async function execProbeShutdownAware(
  file: string,
  args: readonly string[],
  timeoutMs: number,
): Promise<boolean> {
  if (isShutdownRequested()) return false;
  try {
    await execFileShutdownAware(file, args, timeoutMs);
    return true;
  } catch {
    return false;
  }
}
