import { describe, expect, it } from 'vitest';
import { resolveChoice, writeChoice, type ChoiceAgent, type ChoiceStore } from './choice.js';

function memory(): ChoiceStore {
  const values = new Map<string, string>();
  return {
    get: (key) => values.get(key) ?? null,
    set: (key, value) => values.set(key, value),
  };
}

const agents: ChoiceAgent[] = [
  { type: 'cursor-cli', displayName: 'Cursor', detected: true, models: [{ id: 'composer-2.5', label: 'Composer 2.5' }] },
  { type: 'codex-acp', displayName: 'Codex', detected: true, models: [{ id: 'gpt-5.4', label: 'GPT-5.4' }] },
  { type: 'kiro-acp', displayName: 'Kiro', detected: false, models: [] },
];

describe('resolveChoice', () => {
  it('picks the first detected harness until the user chooses', () => {
    expect(resolveChoice(memory(), agents)).toEqual({ harness: 'cursor-cli', model: '' });
  });

  it('keeps a saved harness and model that are still available', () => {
    const store = memory();
    writeChoice(store, { harness: 'codex-acp', model: 'gpt-5.4' });
    expect(resolveChoice(store, agents)).toEqual({ harness: 'codex-acp', model: 'gpt-5.4' });
  });

  it('keeps a saved model while ACP is still detecting models', () => {
    const store = memory();
    writeChoice(store, { harness: 'cursor-cli', model: 'composer-2.5' });
    const pending = agents.map((agent) =>
      agent.type === 'cursor-cli' ? { ...agent, models: [], modelsPending: true } : agent,
    );
    expect(resolveChoice(store, pending).model).toBe('composer-2.5');
  });

  it('drops a model the selected harness does not offer', () => {
    const store = memory();
    writeChoice(store, { harness: 'cursor-cli', model: 'gpt-5.4' });
    expect(resolveChoice(store, agents).model).toBe('');
  });
});
