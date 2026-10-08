import { describe, expect, it } from 'vitest';
import { formatRelativeShort } from './ago.js';
import { promptPreview, sessionPrompts } from './prompts.js';

const session = {
  prompt: 'User request:\nAdd a circle button',
  status: 'completed',
  createdAt: '2026-10-08T10:00:00.000Z',
  updatedAt: '2026-10-08T10:05:00.000Z',
};

describe('sessionPrompts', () => {
  it('keeps the opening request and later user_message turns', () => {
    const rows = sessionPrompts(session, [
      { ts: '2026-10-08T10:02:00.000Z', kind: 'update', payload: { sessionUpdate: 'user_message', text: 'Make it blue' } },
    ]);
    expect(rows.map((row) => row.text)).toEqual(['Add a circle button', 'Make it blue']);
    expect(rows[0]?.status).toBe('completed');
    expect(rows[1]?.sentAt).toBe('2026-10-08T10:02:00.000Z');
  });

  it('marks the latest prompt running while the session is in progress', () => {
    const rows = sessionPrompts({ ...session, status: 'running' }, []);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe('running');
  });
});

describe('promptPreview', () => {
  it('keeps the first two non-empty lines', () => {
    expect(promptPreview('one\n\ntwo\nthree')).toBe('one\ntwo');
  });
});

describe('formatRelativeShort', () => {
  it('uses the dashboard short age labels', () => {
    const now = Date.parse('2026-10-08T12:00:00.000Z');
    expect(formatRelativeShort('2026-10-08T11:48:00.000Z', now)).toBe('12m ago');
    expect(formatRelativeShort('2026-10-08T09:00:00.000Z', now)).toBe('3h ago');
  });
});
