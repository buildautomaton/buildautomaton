import type { AgentHarness } from '@plugins/work/host.js';
import { cachedAgentModels, loadAgentModelCache, type AgentModelOption } from './agent-model-cache.js';
import { dedupeSetup } from './setup-cache.js';

export type SetupModel = AgentModelOption;

export type SetupAgent = {
  type: string;
  displayName: string;
  detected: boolean;
  canInstall: boolean;
  authEnvVar: string | null;
  models: SetupModel[];
  /** True while ACP has not yet reported this detected agent's models. */
  modelsPending: boolean;
};

export type CoordinatorSetup = {
  status: 'idle' | 'waiting' | 'running' | 'failed';
  sessionId?: string;
  harness?: string;
  error?: string;
};

export type BuildAutomatonSetup = {
  cwd: string;
  ready: boolean;
  appNote: string;
  agents: SetupAgent[];
  coordinator?: CoordinatorSetup;
};

export const APP_NOTE =
  'The app has to live in this directory, and its dev server has to be started from here.';

export function describeSetup(cwd: string, harnesses: readonly AgentHarness[]): Promise<BuildAutomatonSetup> {
  const key = `${cwd}\0${harnesses.map((harness) => harness.type).join('\0')}`;
  return dedupeSetup(key, () => loadSetup(cwd, harnesses)).then((setup) => withCachedModels(cwd, setup));
}

async function loadSetup(cwd: string, harnesses: readonly AgentHarness[]): Promise<BuildAutomatonSetup> {
  const agents = await Promise.all(harnesses.map((harness) => describeAgent(harness)));
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
    models: [],
    modelsPending: false,
  };
}

function withCachedModels(cwd: string, setup: BuildAutomatonSetup): BuildAutomatonSetup {
  loadAgentModelCache(cwd);
  return {
    ...setup,
    agents: setup.agents.map((agent) => {
      const models = cachedAgentModels(agent.type);
      return { ...agent, models: models ?? [], modelsPending: agent.detected && models == null };
    }),
  };
}
