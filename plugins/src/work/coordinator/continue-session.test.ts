import { describe, expect, it, vi } from 'vitest';
import type { AcpEngine, SessionImplementation, SessionRecord } from '@plugins/work/host.js';
import { createSqliteWorkBackend } from '../queue/sqlite/backend.js';
import { createCoordinator } from './backend.js';

describe('continueSession', () => {
  it('sends a follow-up on the same ACP session', async () => {
    const work = createSqliteWorkBackend();
    const prompt = vi.fn();
    const created: SessionRecord[] = [];
    const events: unknown[] = [];
    const coord = createCoordinator();
    coord.bind({
      engine: {
        listHarnesses: () => [{ type: 'cursor-cli', displayName: 'Cursor', detectPresence: async () => true }],
        setPreferredHarnessType: () => {},
        prompt,
      } as unknown as AcpEngine,
      backend: {
        create: async (record: SessionRecord) => {
          created.push(record);
        },
        get: async (id: string) => {
          const session = created.find((row) => row.id === id);
          return session ? { session, events: [] } : null;
        },
        patch: async (id: string, patch: Partial<SessionRecord>) => {
          const row = created.find((item) => item.id === id);
          if (row) Object.assign(row, patch);
        },
        append: async (_id: string, event: unknown) => {
          events.push(event);
        },
      } as unknown as SessionImplementation,
      cwd: '/repo',
      log: () => {},
      extras: { work },
    });
    const started = await coord.start({ prompt: 'Build checkout' });
    prompt.mockClear();
    const next = await coord.continue({ sessionId: started.sessionId!, prompt: 'Make it blue' });
    expect(next.sessionId).toBe(started.sessionId);
    expect(prompt).toHaveBeenCalledWith(
      expect.objectContaining({ isNewSession: false, promptText: 'Make it blue', sessionId: started.sessionId }),
    );
    expect(events.some((event) => JSON.stringify(event).includes('user_message'))).toBe(true);
  });
});
