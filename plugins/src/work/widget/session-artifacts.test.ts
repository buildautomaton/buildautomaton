import { describe, expect, it } from 'vitest';
import { artifactsForSession } from './session-artifacts.js';
import type { WorkArtifact } from '../board/types.js';

function artifact(id: string, sessionId: string | null, createdAt: string): WorkArtifact {
  return {
    id,
    workId: null,
    title: id,
    description: '',
    kinds: [],
    sessionId,
    files: [],
    questions: {},
    createdAt,
  };
}

describe('artifactsForSession', () => {
  it('keeps one session in oldest-first order', () => {
    const rows = [
      artifact('b', 's1', '2026-10-07T12:02:00.000Z'),
      artifact('other', 's2', '2026-10-07T12:03:00.000Z'),
      artifact('a', 's1', '2026-10-07T12:01:00.000Z'),
    ];
    expect(artifactsForSession(rows, 's1').map((row) => row.id)).toEqual(['a', 'b']);
  });
});
