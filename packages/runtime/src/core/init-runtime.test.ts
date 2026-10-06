import { describe, expect, it } from 'vitest';
import { initRuntime } from './init-runtime.js';

describe('initRuntime', () => {
  it('registers plugins and services, then runs appliers and lifecycle', async () => {
    const seen: string[] = [];
    const runtime = initRuntime({
      plugins: [
        {
          name: 'sql',
          services: [
            {
              id: 'sql-store',
              interface: { name: 'SqlStore' },
              options: { backend: 'd1' },
              implementation: { backend: 'd1' },
            },
          ],
          start: () => {
            seen.push('start');
          },
          stop: () => {
            seen.push('stop');
          },
        },
      ],
    });
    runtime.appliers.register('sql-store', (_ctx, plugin) => {
      seen.push(`apply:${plugin.name}`);
    });
    runtime.apply();
    expect(runtime.services.interfaceOf('sql-store')).toEqual({ name: 'SqlStore' });
    expect(runtime.services.implementations('sql-store')).toEqual([{ backend: 'd1' }]);
    expect(seen).toEqual(['apply:sql']);
    await runtime.start();
    await runtime.stop();
    expect(seen).toEqual(['apply:sql', 'start', 'stop']);
  });
});
