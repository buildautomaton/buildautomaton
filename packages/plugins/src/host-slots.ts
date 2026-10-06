import type { PluginSlots } from '@buildautomaton/runtime';
import type { AnySqlStore, SqlStoreOpener } from './stores/sql-store/index.js';
import type { AnyFileStore } from './stores/file-store/index.js';
import type { SessionPlugin } from './session/session/plugin.js';
import type { SessionBackend, SessionBackendWrap } from './session/session/backend.js';
import type { SessionHooks } from './session/session/hooks.js';
import type { HttpRegistry, HttpRoute } from './transport/http/types/registry.js';
import type { HostTransport } from './transport/transport/host.js';
import type { TransportEndpoint } from './transport/transport/endpoints.js';
import type { TransportHooks } from './transport/transport/hooks.js';
import type { AgentHarness } from './harnesses/acp/host/types.js';
import type { HarnessHooks } from './harnesses/harness/hooks.js';
import type { HarnessHostImplementation } from './harnesses/harness/host.js';
import type { ToolsImplementation, ToolRegistry } from './tools/tools/implementation.js';
import type { ToolsHooks } from './tools/tools/hooks.js';
import type { RuntimeHandle } from '@buildautomaton/runtime';
export type AttachFetch = (
  handle: Omit<RuntimeHandle, 'fetch'>,
  opts: { path: string; routes: readonly HttpRoute[]; tools: ToolRegistry; log: (line: string) => void },
) => RuntimeHandle;

export type HostSlots = PluginSlots & {
  fileStore?: AnyFileStore;
  sqlStore?: AnySqlStore;
  sqlStores: Record<string, AnySqlStore>;
  sqlOpeners: Record<string, SqlStoreOpener>;
  sessionPlugins: SessionPlugin[];
  backend?: SessionBackend;
  backendWraps: SessionBackendWrap[];
  sessionHooks?: SessionHooks;
  harnesses: AgentHarness[];
  harnessHooks?: HarnessHooks;
  harnessHost?: HarnessHostImplementation;
  tools: ToolsImplementation[];
  toolsHooks?: ToolsHooks;
  transport?: HostTransport;
  transportHooks?: TransportHooks;
  http?: HttpRegistry;
  httpEndpoints: TransportEndpoint[];
  attachFetch?: AttachFetch;
};

export function asHost(slots: PluginSlots): HostSlots {
  const host = slots as HostSlots;
  host.sqlStores ??= {};
  host.sqlOpeners ??= {};
  host.sessionPlugins ??= [];
  host.backendWraps ??= [];
  host.harnesses ??= [];
  host.tools ??= [];
  host.httpEndpoints ??= [];
  return host;
}
