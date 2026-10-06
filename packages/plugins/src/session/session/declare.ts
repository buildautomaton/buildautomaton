import type { RuntimePlugin } from '@buildautomaton/runtime';
export function sessionService(): RuntimePlugin {
  return {
    name: 'session',
    services: [{ id: 'session', interface: { id: 'session', name: 'Session' } }],
  };
}
