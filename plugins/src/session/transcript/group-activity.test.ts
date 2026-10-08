import { describe, expect, it } from 'vitest';
import { groupActivity } from './group-activity.js';
import type { TranscriptViewBlock } from './block.js';

const thought = (text: string): TranscriptViewBlock => ({ kind: 'thought', text });
const tool = (key: string): TranscriptViewBlock => ({
  kind: 'tool',
  key,
  title: key,
  status: 'completed',
  detail: '',
});

describe('groupActivity', () => {
  it('groups consecutive thought and tool rows', () => {
    const blocks = groupActivity([
      { kind: 'user', text: 'Hi' },
      { kind: 'text', text: 'Sure' },
      thought('hmm'),
      tool('t1'),
      { kind: 'text', text: 'Done' },
    ]);
    expect(blocks.map((block) => block.kind)).toEqual(['user', 'text', 'activity', 'text']);
    expect(blocks[2]).toMatchObject({ kind: 'activity', title: '1 tool call and reasoning' });
  });

  it('peels a trailing thought so live reasoning stays visible', () => {
    const blocks = groupActivity([tool('t1'), thought('still thinking')]);
    expect(blocks.map((block) => block.kind)).toEqual(['tool', 'thought']);
  });
});
