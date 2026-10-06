import type { RuntimePlugin } from '@buildautomaton/runtime';
export function transportService(): RuntimePlugin {
  return {
    name: 'transport',
    services: [{ id: 'transport', interface: { id: 'transport', name: 'Transport' } }],
  };
}
