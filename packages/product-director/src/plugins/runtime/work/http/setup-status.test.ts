import { describe, expect, it } from 'vitest';
import type { AgentHarness } from '@buildautomaton/runtime';
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
  it('is ready when an agent is already on the machine', async () => {
    const setup = await describeSetup('/repo', [harness('cursor-cli', true), harness('codex-acp', false)]);
    expect(setup.cwd).toBe('/repo');
    expect(setup.ready).toBe(true);
    expect(setup.agents.map((agent) => agent.detected)).toEqual([true, false]);
    expect(setup.appNote).toMatch(/dev server/);
  });

  it('stays in setup when nothing is detected', async () => {
    const setup = await describeSetup('/repo', [harness('codex-acp', false)]);
    expect(setup.ready).toBe(false);
    expect(setup.agents[0]?.canInstall).toBe(true);
  });
});
