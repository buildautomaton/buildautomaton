import type { ExtensionPlugin } from '@plugins/extension-plugin.js';
import { attachAcpLive } from './live.js';

/** Interface + compose plugin: builds the ACP engine and runtime handle. */
export function acpPlugin(): ExtensionPlugin {
  return {
    name: 'acp',
    description: 'ACP engine interface. Use with harness plugins so the runtime can spawn and talk to coding agents.',
    targetRuntime: 'node',
    services: [{ id: 'acp', interface: { id: 'acp', name: 'AcpEngine' } }],
    contributeHttp(_http, ctx) {
      attachAcpLive(ctx.extras);
    },
  };
}
