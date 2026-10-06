import type { AcpEngine } from '@runtime/acp/engine/types.js';
import type { LogFn } from '@/types/log.js';
import type { SessionImplementation } from '@/types/session/implementation.js';
import type { TransportHooks } from '@/types/transport/hooks.js';
import type { AccessPort } from './local-mcp.js';

export type CoordinatorBind = {
  bind(ctx: {
    engine: AcpEngine;
    backend: SessionImplementation;
    cwd: string;
    log: LogFn;
    extras: Record<string, unknown>;
  }): void;
};

export function onListening(opts: {
  access: AccessPort;
  transportHooks?: TransportHooks;
  extras: Record<string, unknown>;
  engine: AcpEngine;
  backend: SessionImplementation;
  cwd: string;
  log: LogFn;
}) {
  return (info: { url: string; port: number }) => {
    opts.access.port = info.port;
    opts.transportHooks?.onListening?.(info);
    const coordinator = opts.extras.coordinator as CoordinatorBind | undefined;
    coordinator?.bind({
      engine: opts.engine,
      backend: opts.backend,
      cwd: opts.cwd,
      log: opts.log,
      extras: opts.extras,
    });
  };
}
