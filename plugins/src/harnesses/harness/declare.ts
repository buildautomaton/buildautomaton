import type { RuntimePlugin } from '@buildautomaton/runtime';
export function harnessService(): RuntimePlugin {
  return {
    name: 'harness',
    services: [{ id: 'harness', interface: { id: 'harness', name: 'Harness' } }],
  };
}
