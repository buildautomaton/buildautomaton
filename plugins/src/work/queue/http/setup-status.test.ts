import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AgentHarness } from '@plugins/work/host.js';
import { clearAgentModelCache } from './agent-model-cache.js';
import { clearSetupCache } from './setup-cache.js';
import { describeSetup } from './setup-status.js';

const harness = (type: string, detected: boolean, install = true): AgentHarness =>
  ({
    type,
    displayName: type,
    detectPresence: async () => detected,
    install: install ? async () => {} : undefined,
    installTokenEnvVar: 'TOKEN',
  }) as AgentHarness;

describe('describeSetup', () => {
  beforeEach(() => {
    clearSetupCache();
    clearAgentModelCache();
  });

  it('is ready when an agent is already on the machine', async () => {
    const setup = await describeSetup('/repo', [harness('cursor-cli', true), harness('codex-acp', false)]);
    expect(setup.cwd).toBe('/repo');
    expect(setup.ready).toBe(true);
    expect(setup.agents.map((agent) => agent.detected)).toEqual([true, false]);
    expect(setup.agents.map((agent) => agent.modelsPending)).toEqual([true, false]);
    expect(setup.appNote).toMatch(/dev server/);
  });

  it('stays in setup when nothing is detected', async () => {
    const setup = await describeSetup('/repo', [harness('codex-acp', false)]);
    expect(setup.ready).toBe(false);
    expect(setup.agents[0]?.canInstall).toBe(true);
    expect(setup.agents[0]?.models).toEqual([]);
  });

  it('starts every harness probe before the first one finishes', async () => {
    let started = 0;
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const slow = (type: string): AgentHarness =>
      ({
        type,
        displayName: type,
        detectPresence: async () => {
          started += 1;
          await gate;
          return true;
        },
      }) as AgentHarness;
    const pending = describeSetup('/parallel', [slow('a'), slow('b')]);
    await vi.waitFor(() => expect(started).toBe(2));
    release();
    expect((await pending).ready).toBe(true);
  });
});
