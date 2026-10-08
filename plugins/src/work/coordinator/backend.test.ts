import { describe, expect, it, vi } from 'vitest';
import type { AcpEngine, SessionImplementation, SessionRecord } from '@plugins/work/host.js';
import { createSqliteWorkBackend } from '../queue/sqlite/backend.js';
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
        append: async () => undefined,
      } as unknown as SessionImplementation,
      cwd: '/repo',
      log: () => {},
      extras: { work },
    },
  };
}

describe('buildautomaton session starter', () => {
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
    expect(bound.created[0]?.prompt).toContain('tell_buildautomaton_what_was_built');
    expect(prompt).toHaveBeenCalledOnce();
    expect((await work.getWork(status.work!.id))?.sessionIds).toContain(status.sessionId);
  });

  it('starts on the harness and model from the prompt', async () => {
    const work = createSqliteWorkBackend();
    const prompt = vi.fn();
    const created: SessionRecord[] = [];
    const coord = createCoordinator();
    coord.bind({
      engine: {
        listHarnesses: () => [
          { type: 'cursor-cli', displayName: 'Cursor', detectPresence: async () => true },
          { type: 'codex-acp', displayName: 'Codex', detectPresence: async () => true },
        ],
        setPreferredHarnessType: () => {},
        prompt,
      } as unknown as AcpEngine,
      backend: {
        create: async (record: SessionRecord) => {
          created.push(record);
        },
        append: async () => undefined,
        patch: async () => undefined,
      } as unknown as SessionImplementation,
      cwd: '/repo',
      log: () => {},
      extras: { work },
    });
    const status = await coord.start({ prompt: 'Build', harness: 'codex-acp', model: 'gpt-5.4' });
    expect(status.harness).toBe('codex-acp');
    expect(created[0]?.model).toBe('gpt-5.4');
    expect(prompt).toHaveBeenCalledWith(
      expect.objectContaining({ agentType: 'codex-acp', agentConfig: { agent_model: 'gpt-5.4' } }),
    );
  });
});
