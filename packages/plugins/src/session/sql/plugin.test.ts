import { describe, expect, it } from 'vitest';
import { applyPlugins } from '@buildautomaton/runtime';
import { asHost } from '@plugins/host-slots.js';
import { sqlStorePlugin } from '@plugins/stores/sqlite/plugin.js';
import '@plugins/register-services.js';
import { sqlSessionPlugin } from './plugin.js';

describe('sqlSessionPlugin', () => {
  it('stores sessions on the work SQL schema', async () => {
    const slots = applyPlugins(
      [sqlStorePlugin({ options: { file: ':memory:' } }), sqlSessionPlugin()],
      { cwd: '/', log: () => {} },
    );
    const host = asHost(slots);
    expect(host.backend).toBeDefined();
    await host.backend!.create({
      id: 's1',
      harness: 'cursor',
      prompt: 'hi',
      cwd: '/',
      status: 'completed',
      runId: 'r1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(host.backend!.list()).toHaveLength(1);
  });
});
