import type { RuntimePlugin } from '@buildautomaton/runtime';
/** Interface + compose plugin: builds the ACP engine and runtime handle. */
export function acpPlugin(): RuntimePlugin {
  return {
    name: 'acp',
    kind: 'acp',
    services: [{ id: 'acp', interface: { id: 'acp', name: 'AcpEngine' } }],
  };
}
