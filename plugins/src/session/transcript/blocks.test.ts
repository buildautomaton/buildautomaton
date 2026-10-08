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
    expect(blocks.map((block) => block.kind)).toEqual(['user', 'text', 'activity', 'text']);
    expect(blocks[0]).toMatchObject({ kind: 'user', text: 'Add a circle button' });
    expect(blocks[1]).toMatchObject({ kind: 'text', text: 'Hel' });
    expect(blocks[2]).toMatchObject({ kind: 'activity', title: '1 tool call and reasoning' });
    expect(blocks[3]).toMatchObject({ kind: 'text', text: 'lo' });
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

  it('shows follow-up prompts, permissions, files, and plans', () => {
    const blocks = transcriptBlocks({ prompt: 'Ship it' }, [
      { kind: 'update', payload: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'Ok' } } },
      {
        kind: 'request',
        payload: {
          type: 'session_update',
          requestId: 'p1',
          kind: 'permission',
          payload: {
            sessionUpdate: 'permission',
            method: 'session/request_permission',
            params: { toolCall: { title: 'Read .env' } },
          },
        },
      },
      { kind: 'update', payload: { sessionUpdate: 'file_change', path: 'src/a.ts' } },
      { kind: 'update', payload: { sessionUpdate: 'user_message', content: { type: 'text', text: 'Also tests' } } },
      { kind: 'update', payload: { sessionUpdate: 'plan', title: 'Plan', entries: ['write tests'] } },
    ]);
    expect(blocks.map((block) => block.kind)).toEqual(['user', 'text', 'permission', 'files', 'user', 'detail']);
    expect(blocks[2]).toMatchObject({ kind: 'permission', title: 'Read .env' });
    expect(blocks[3]).toMatchObject({ kind: 'files', paths: ['src/a.ts'] });
    expect(blocks[4]).toMatchObject({ kind: 'user', text: 'Also tests' });
    expect(blocks[5]).toMatchObject({ kind: 'detail', title: 'Plan' });
  });
});

describe('sessionTitle', () => {
  it('uses the first line of the user request', () => {
    expect(sessionTitle(prompt)).toBe('Add a circle button');
  });
});
