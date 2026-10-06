import type { RuntimePlugin } from '@buildautomaton/runtime';
export function toolsService(): RuntimePlugin {
  return {
    name: 'tools',
    services: [{ id: 'tools', interface: { id: 'tools', name: 'Tools' } }],
  };
}
