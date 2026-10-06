import type { LogFn } from '@buildautomaton/runtime';
import type { ClientHostHooks } from './types.js';
import type { ReportAgentCapabilitiesFn } from '@plugins/harnesses/acp/capability-types.js';
import type { AcpSessionAgentKey } from '@plugins/harnesses/acp/keys/acp-agent.js';
import { AcpPromptRoutingRegistry } from '@plugins/harnesses/acp/keys/acp-prompt-routing-registry.js';
import type { AcpClientState } from '@plugins/harnesses/acp/lifecycle/acp-client-state.js';
import {
  createHarnessRegistry,
  type RuntimeHarnessRegistry,
} from '@plugins/harnesses/acp/host/create-registry.js';

export type RunDispatchMeta = {
  acpSessionAgentKey: AcpSessionAgentKey;
};

export type AcpEngineContext = {
  log: LogFn;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  clientHostHooks?: ClientHostHooks;
  isShutdownRequested?: () => boolean;
  clientInfo?: { name: string; version: string };
  harnesses: RuntimeHarnessRegistry;
  backendFallbackAgentType: string | null;
  acpAgents: Map<AcpSessionAgentKey, AcpClientState>;
  promptRouting: AcpPromptRoutingRegistry;
  runDispatch: Map<string, RunDispatchMeta>;
  pendingCancelRunIds: Set<string>;
};

export function createAcpEngineContext(options: {
  log: LogFn;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  clientHostHooks?: ClientHostHooks;
  isShutdownRequested?: () => boolean;
  clientInfo?: { name: string; version: string };
}): AcpEngineContext {
  return {
    log: options.log,
    reportAgentCapabilities: options.reportAgentCapabilities,
    clientHostHooks: options.clientHostHooks,
    isShutdownRequested: options.isShutdownRequested,
    clientInfo: options.clientInfo,
    harnesses: createHarnessRegistry(),
    backendFallbackAgentType: null,
    acpAgents: new Map(),
    promptRouting: new AcpPromptRoutingRegistry(),
    runDispatch: new Map(),
    pendingCancelRunIds: new Set(),
  };
}
