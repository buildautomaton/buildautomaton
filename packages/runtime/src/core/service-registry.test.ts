import { describe, expect, it } from 'vitest';
import { initRuntime } from './init-runtime.js';
import { createServiceRegistry } from './service-registry.js';

describe('service registry', () => {
  it('stores an interface separately from an implementation', () => {
    const services = createServiceRegistry();
    services.define('sql-store', { name: 'SqlStore' });
    services.provide({
      id: 'sql-store',
      plugin: 'store-sql-d1',
      options: { backend: 'd1', schema: 'marketplace' },
      implementation: { backend: 'd1' },
    });
    expect(services.interfaceOf('sql-store')).toEqual({ name: 'SqlStore' });
    expect(services.get('sql-store')).toEqual({ backend: 'd1' });
    expect(services.getAll('sql-store')[0]?.options).toEqual({ backend: 'd1', schema: 'marketplace' });
  });

  it('collects plugin services on the runtime', () => {
    const runtime = initRuntime({
      plugins: [
        {
          name: 'listings',
          services: [
            { id: 'sql-store', interface: { name: 'SqlStore' }, options: { backend: 'd1' } },
            { id: 'sql-store', implementation: { all: () => [] }, options: { schema: 'marketplace' } },
          ],
        },
      ],
    });
    runtime.apply();
    expect(runtime.plugins.byService('sql-store').map((plugin) => plugin.name)).toEqual(['listings']);
    expect(runtime.services.implementations('sql-store')).toHaveLength(1);
  });
});
