import type { AgentHarness } from '@plugins/buildautomaton/host.js';

export type SetupAgent = {
  type: string;
  displayName: string;
  detected: boolean;
  canInstall: boolean;
  authEnvVar: string | null;
};

export type CoordinatorSetup = {
  status: 'idle' | 'waiting' | 'running' | 'failed';
  sessionId?: string;
  harness?: string;
  error?: string;
};

export type BuildautomatonSetup = {
  cwd: string;
  ready: boolean;
  appNote: string;
  agents: SetupAgent[];
  coordinator?: CoordinatorSetup;
};

export const APP_NOTE =
  'The app has to live in this directory, and its dev server has to be started from here.';

export async function describeSetup(cwd: string, harnesses: readonly AgentHarness[]): Promise<BuildautomatonSetup> {
  const agents: SetupAgent[] = [];
  for (const harness of harnesses) agents.push(await describeAgent(harness));
  return { cwd, ready: agents.some((agent) => agent.detected), appNote: APP_NOTE, agents };
}

async function describeAgent(harness: AgentHarness): Promise<SetupAgent> {
  let detected = false;
  try {
    detected = Boolean(await harness.detectPresence?.());
  } catch {
    detected = false;
  }
  return {
    type: harness.type,
    displayName: harness.displayName,
    detected,
    canInstall: Boolean(harness.install),
    authEnvVar: harness.installTokenEnvVar ?? null,
  };
}
