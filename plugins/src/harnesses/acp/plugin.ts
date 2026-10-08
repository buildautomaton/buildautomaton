import type { RuntimePlugin } from '@buildautomaton/runtime';
/** Interface + compose plugin: builds the ACP engine and runtime handle. */
export function acpPlugin(): RuntimePlugin {
  return {
    name: 'acp',
    description: 'ACP engine interface. Use with harness plugins so the runtime can spawn and talk to coding agents.',
    targetRuntime: 'node',
    services: [{ id: 'acp', interface: { id: 'acp', name: 'AcpEngine' } }],
  };
}
