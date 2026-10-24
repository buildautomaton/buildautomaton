import { describe, expect, it } from 'vitest';
import { nextProbeType } from './warm-models.js';

describe('nextProbeType', () => {
  it('probes the preferred detected agent before the others', () => {
    const detected = ['cursor-cli', 'codex-acp', 'kiro-acp'];
    const seen = new Set<string>();
    expect(nextProbeType(detected, seen, 'kiro-acp')).toBe('kiro-acp');
    seen.add('kiro-acp');
    expect(nextProbeType(detected, seen, 'kiro-acp')).toBe('cursor-cli');
  });

  it('ignores a preference that is not detected', () => {
    expect(nextProbeType(['cursor-cli'], new Set(), 'opencode')).toBe('cursor-cli');
  });
});
