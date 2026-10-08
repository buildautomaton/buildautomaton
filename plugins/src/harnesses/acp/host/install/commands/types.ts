import type { AgentInstallContext } from '@plugins/harnesses/harness/host.js';

export type AgentInstallCommand = {
  agentType: string;
  detectCommand: string;
  alternateDetectCommands?: readonly string[];
  install(ctx: AgentInstallContext): Promise<void>;
};
