import type { RuntimeHandle } from '@buildautomaton/runtime';
import type { AcpEngine } from '../engine/types.js';
import type { CommandHost } from '../../../transport/transport/implementation.js';
import type { HostTransport } from '../../../transport/transport/host.js';
import type { TransportHooks } from '../../../transport/transport/hooks.js';
import type { ToolRegistry } from '../../../tools/tools/implementation.js';
import type { NotifierHub } from '../../../tools/tools/notify.js';
import type { HttpRegistry } from '../../../transport/http/types/registry.js';

export function bindHandle(opts: {
  cwd: string;
  engine: AcpEngine;
  transport: HostTransport;
  tools: ToolRegistry;
  transportHooks?: TransportHooks;
  notifier?: NotifierHub;
  http?: HttpRegistry;
  onListening?: CommandHost['onListening'];
  plugins: RuntimeHandle['plugins'];
  services: RuntimeHandle['services'];
}): Omit<RuntimeHandle, 'fetch'> {
  const { cwd, engine, transport, tools, transportHooks, notifier, http, onListening, plugins, services } = opts;
  const host: CommandHost = {
    cwd,
    listTools: tools.listTools,
    callTool: tools.callTool,
    notifier,
    http,
    onListening,
  };
  return {
    cwd,
    plugins,
    services,
    extras: { engine },
    start: async () => {
      transportHooks?.onStart?.({ cwd });
      await transport.start(host);
    },
    stop: async () => {
      await transport.stop();
      transportHooks?.onStop?.();
      await engine.disconnect();
    },
  };
}
