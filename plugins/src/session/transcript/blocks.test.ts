import { describe, expect, it } from 'vitest';
import { transcriptBlocks } from './blocks.js';
import { sessionTitle } from './user-request.js';

const prompt = `[buildautomaton-session]
sessionId: abc

User request:
Add a circle button`;

describe('transcriptBlocks', () => {
  it('shows the user request, merged message chunks, and one tool row', () => {
    const blocks = transcriptBlocks({ prompt }, [
      { kind: 'update', payload: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'Hel' } } },
      { kind: 'update', payload: { sessionUpdate: 'agent_thought_chunk', content: { type: 'text', text: 'hmm' } } },
      {
        kind: 'update',
        payload: { sessionUpdate: 'tool_call', toolCallId: 't1', title: 'Edit button', status: 'in_progress' },
      },
      {
        kind: 'update',
        payload: {
          sessionUpdate: 'tool_call_update',
          toolCallId: 't1',
          title: 'Edit button',
          status: 'completed',
          rawOutput: 'ok',
        },
      },
      { kind: 'update', payload: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'lo' } } },
    ]);
    expect(blocks.map((block) => block.kind)).toEqual(['user', 'text', 'thought', 'tool', 'text']);
    expect(blocks[0]).toMatchObject({ kind: 'user', text: 'Add a circle button' });
    expect(blocks[1]).toMatchObject({ kind: 'text', text: 'Hel' });
    expect(blocks[3]).toMatchObject({ kind: 'tool', key: 't1', status: 'completed', detail: 'ok' });
    expect(blocks[4]).toMatchObject({ kind: 'text', text: 'lo' });
  });

  it('uses result output when the agent sent no message', () => {
    const blocks = transcriptBlocks({ prompt: 'Ship it' }, [
      { kind: 'result', payload: { output: 'done' } },
    ]);
    expect(blocks).toEqual([
      { kind: 'user', text: 'Ship it' },
      { kind: 'text', text: 'done' },
    ]);
  });
});

describe('sessionTitle', () => {
  it('uses the first line of the user request', () => {
    expect(sessionTitle(prompt)).toBe('Add a circle button');
  });
});
