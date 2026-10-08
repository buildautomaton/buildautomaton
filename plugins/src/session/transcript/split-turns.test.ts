import { describe, expect, it } from 'vitest';
import { splitTurns } from './split-turns.js';

describe('splitTurns', () => {
  it('splits user prompts into turns and keeps a preamble', () => {
    const { preamble, turns } = splitTurns([
      { kind: 'text', text: 'hello' },
      { kind: 'user', text: 'First' },
      { kind: 'text', text: 'One' },
      { kind: 'user', text: 'Second' },
      { kind: 'thought', text: 'hmm' },
    ]);
    expect(preamble).toEqual([{ kind: 'text', text: 'hello' }]);
    expect(turns).toHaveLength(2);
    expect(turns[0]?.user.text).toBe('First');
    expect(turns[0]?.response).toEqual([{ kind: 'text', text: 'One' }]);
    expect(turns[1]?.user.text).toBe('Second');
    expect(turns[1]?.response[0]).toMatchObject({ kind: 'thought', text: 'hmm' });
  });
});
