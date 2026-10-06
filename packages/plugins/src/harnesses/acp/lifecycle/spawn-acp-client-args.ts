import type { AcpClientOptions } from '@plugins/harnesses/acp/client-types.js';
import type { ClientHostHooks } from '@plugins/harnesses/acp/engine/types.js';
import type { ReportAgentCapabilitiesFn } from '@plugins/harnesses/acp/capability-types.js';
import type { LogFn } from '@buildautomaton/runtime';
import type { ResolvedAgentCommand } from '@plugins/harnesses/acp/keys/resolve-agent-command.js';
import type { GetAgentHarnessFn } from '@plugins/harnesses/acp/host/types.js';
import type { AcpClientState } from './acp-client-state.js';
import { acpPersistCallbacks } from './acp-persist-callbacks.js';
import { acpSessionHooks } from './acp-session-hooks.js';

export type SpawnAcpClientParams = {
  state: AcpClientState;
  resolved: ResolvedAgentCommand;
  preferredAgentType: string | null;
  mode?: string;
  agentConfig?: Record<string, unknown> | null;
  targetCwd: string;
  acpAgentKey: string;
  scopeId?: string;
  mcpServers: unknown[];
  sendSessionUpdate: (payload: unknown) => void;
  sendRequest: (payload: unknown) => void;
  reportAgentCapabilities?: ReportAgentCapabilitiesFn;
  log: LogFn;
  hostHooks?: ClientHostHooks;
  getHarness: GetAgentHarnessFn;
  clientInfo?: { name: string; version: string };
};

export function spawnCreateClientOptions(
  params: SpawnAcpClientParams,
  state: AcpClientState,
  persistedAcpSessionId: string | null,
): AcpClientOptions {
  return {
    command: params.resolved.command,
    sessionMode: params.mode,
    agentConfig: params.agentConfig ?? null,
    backendAgentType: params.preferredAgentType,
    persistedAcpSessionId,
    getActiveConfigOptions: () => state.activeSessionConfigOptions,
    ...acpPersistCallbacks({
      state,
      hostHooks: params.hostHooks,
      scopeId: params.scopeId,
      preferredAgentType: params.preferredAgentType,
      persistedAcpSessionId,
      reportAgentCapabilities: params.reportAgentCapabilities,
    }),
    ...acpSessionHooks({
      hostHooks: params.hostHooks,
      sendSessionUpdate: params.sendSessionUpdate,
      sendRequest: params.sendRequest,
    }),
    cwd: params.targetCwd,
    scopeId: params.scopeId ?? null,
    mcpServers: params.mcpServers,
    authErrorHints: params.getHarness(params.preferredAgentType)?.authErrorHints,
    clientInfo: params.clientInfo,
  };
}
