import { describe, expect, it, vi } from 'vitest';
import type { AcpEngine, SessionImplementation, SessionRecord } from '@buildautomaton/plugins';
import { createSqliteWorkBackend } from '../work/sqlite/backend.js';
import { createCoordinator } from './backend.js';
import { SESSION_MARK } from './prompt.js';

function ctx(work: ReturnType<typeof createSqliteWorkBackend>, prompt = vi.fn()) {
  const created: SessionRecord[] = [];
  return {
    created,
    prompt,
    value: {
      engine: {
        listHarnesses: () => [{ type: 'cursor-cli', displayName: 'Cursor', detectPresence: async () => true }],
        setPreferredHarnessType: () => {},
        prompt,
      } as unknown as AcpEngine,
      backend: {
        list: async () => created,
        create: async (record: SessionRecord) => {
          created.push(record);
        },
        patch: async () => undefined,
      } as unknown as SessionImplementation,
      cwd: '/repo',
      log: () => {},
      extras: { work },
    },
  };
}

describe('director session starter', () => {
  it('waits when no agent is installed', async () => {
    const coord = createCoordinator();
    coord.bind({
      engine: { listHarnesses: () => [] } as unknown as AcpEngine,
      backend: { list: async () => [] } as unknown as SessionImplementation,
      cwd: '/repo',
      log: () => {},
      extras: { work: createSqliteWorkBackend() },
    });
    expect((await coord.start({ prompt: 'Build checkout' })).status).toBe('waiting');
  });

  it('starts an ACP session for a prompt and does not loop', async () => {
    const work = createSqliteWorkBackend();
    const prompt = vi.fn((args: { sendResult: (result: { success: boolean }) => void }) => {
      args.sendResult({ success: true });
    });
    const bound = ctx(work, prompt);
    const coord = createCoordinator();
    coord.bind(bound.value);
    const status = await coord.start({ prompt: 'Build checkout', project: 'Shop' });
    expect(status.status).toBe('running');
    expect(status.work?.status).toBe('in_progress');
    expect(bound.created[0]?.prompt).toContain(SESSION_MARK);
    expect(bound.created[0]?.prompt).toContain('Build checkout');
    expect(bound.created[0]?.prompt).toContain('tell_product_director_what_was_built');
    expect(prompt).toHaveBeenCalledOnce();
    expect((await work.getWork(status.work!.id))?.sessionIds).toContain(status.sessionId);
  });
});
