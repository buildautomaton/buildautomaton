import { describe, expect, it } from 'vitest';
import type { AcpEngine, AgentHarness } from '@plugins/work/host.js';
import { pickCoordinatorHarness } from './pick-harness.js';

function engine(harnesses: AgentHarness[]): AcpEngine {
  return { listHarnesses: () => harnesses } as unknown as AcpEngine;
}

describe('pickCoordinatorHarness', () => {
  it('returns the first detected harness', async () => {
    const picked = await pickCoordinatorHarness(
      engine([
        { type: 'missing', displayName: 'No', detectPresence: async () => false } as AgentHarness,
        { type: 'cursor-cli', displayName: 'Cursor', detectPresence: async () => true } as AgentHarness,
      ]),
    );
    expect(picked?.type).toBe('cursor-cli');
  });

  it('returns null when nothing is installed', async () => {
    expect(await pickCoordinatorHarness(engine([]))).toBeNull();
  });

  it('prefers the harness the user selected', async () => {
    const picked = await pickCoordinatorHarness(
      engine([
        { type: 'cursor-cli', displayName: 'Cursor', detectPresence: async () => true } as AgentHarness,
        { type: 'codex-acp', displayName: 'Codex', detectPresence: async () => true } as AgentHarness,
      ]),
      'codex-acp',
    );
    expect(picked?.type).toBe('codex-acp');
  });
});
