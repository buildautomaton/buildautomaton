import type { NotifierHub } from '../../tools/tools/notify.js';
import type { ToolRegistry } from '../../tools/tools/implementation.js';
import type { HttpRegistry } from '../http/types/registry.js';

export type CommandHost = ToolRegistry & {
  cwd: string;
  notifier?: NotifierHub;
  http?: HttpRegistry;
  onListening?: (info: { url: string; port: number }) => void;
};

/** Methods a transport plugin may override. */
export type TransportImplementation = {
  start(host: CommandHost): Promise<void> | void;
  stop(): Promise<void> | void;
};
