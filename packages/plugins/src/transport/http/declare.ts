import type { RuntimePlugin } from '@buildautomaton/runtime';
export function httpService(): RuntimePlugin {
  return {
    name: 'http',
    services: [{ id: 'http', interface: { id: 'http', name: 'Http' } }],
  };
}
