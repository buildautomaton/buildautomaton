import { describe, expect, it } from 'vitest';
import { elapsedLabel, sessionElapsed } from './elapsed.js';

describe('elapsedLabel', () => {
  it('formats seconds, minutes, and hours', () => {
    const start = Date.parse('2026-10-07T12:00:00.000Z');
    expect(elapsedLabel('2026-10-07T12:00:00.000Z', start + 4_000)).toBe('4s');
    expect(elapsedLabel('2026-10-07T12:00:00.000Z', start + 65_000)).toBe('1m 05s');
    expect(elapsedLabel('2026-10-07T12:00:00.000Z', start + 3_700_000)).toBe('1h 1m');
  });
});

describe('sessionElapsed', () => {
  it('keeps running time live and freezes finished sessions', () => {
    const session = {
      status: 'completed',
      createdAt: '2026-10-07T12:00:00.000Z',
      updatedAt: '2026-10-07T12:00:12.000Z',
    };
    expect(sessionElapsed(session, Date.parse('2026-10-07T13:00:00.000Z'))).toBe('12s');
    expect(
      sessionElapsed({ ...session, status: 'running' }, Date.parse('2026-10-07T12:00:09.000Z')),
    ).toBe('9s');
  });
});
