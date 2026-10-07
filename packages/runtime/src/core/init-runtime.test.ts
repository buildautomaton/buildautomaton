import { describe, expect, it } from 'vitest';
import { initRuntime } from './init-runtime.js';

describe('initRuntime', () => {
  it('registers plugins and services, then runs lifecycle', async () => {
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
    expect(runtime.services.interfaceOf('sql-store')).toEqual({ name: 'SqlStore' });
    expect(runtime.services.implementations('sql-store')).toEqual([{ backend: 'd1' }]);
    await runtime.start();
    await runtime.stop();
    expect(seen).toEqual(['start', 'stop']);
  });
});
