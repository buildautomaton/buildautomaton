import '../register-services.js';

export type {
  LogFn,
  PluginFactory,
  PluginInit,
  PluginRuntimeContext,
  RuntimePlugin,
  ServiceContribution,
} from '@buildautomaton/runtime';
export { createPluginSlots, HTTP_DEFAULT_WORK_ROOT, joinHttpPath } from '@buildautomaton/runtime';

export type { SqlMigration, SqlStore } from '@plugins/stores/sql-store/index.js';
export { DEFAULT_SQL_SCHEMA } from '@plugins/stores/sql-store/schema.js';
export { requireSqlStore } from '@plugins/stores/sql-store/pick.js';
export { sqlStorePlugin } from '@plugins/stores/sqlite/plugin.js';
export { fileStorePlugin } from '@plugins/stores/disk/plugin.js';

export type { ToolsPlugin, ToolsPluginInit } from '@plugins/tools/tools/plugin.js';
export type { ToolContext, ToolsImplementation } from '@plugins/tools/tools/implementation.js';
export type { McpToolCallResult, McpToolDefinition } from '@plugins/tools/tools/definitions.js';

export type { AgentHarness } from '@plugins/harnesses/acp/host/types.js';
export type { AcpEngine } from '@plugins/harnesses/acp/engine/types.js';
export { installLocalAgentOnBridge } from '@plugins/harnesses/acp/host/install/install-local-agent.js';

export { closeServer, listenLocalhost } from '@plugins/transport/http/http-listen.js';
export { createHttpRegistry } from '@plugins/transport/http/registry.js';
export { createMcpSseHub } from '@plugins/transport/http/sse-hub.js';
export { handleHttpRequest } from '@plugins/transport/http/http-handler.js';
export { httpTransportPlugin } from '@plugins/transport/http/plugin.js';
export type { HttpRegistry } from '@plugins/transport/http/types/registry.js';
export type { HttpContributeContext, StoreContext } from '@plugins/transport/http/types/contribution.js';

export type { TransportEndpoint } from '@plugins/transport/transport/endpoints.js';
export type { PluginSupport } from '@plugins/session/session/capability.js';
export type { SessionImplementation } from '@plugins/session/session/implementation.js';
export type { SessionRecord } from '@plugins/session/session/records.js';
export { diskSessionPlugin } from '@plugins/session/disk/plugin.js';

export type { ExtensionPlugin } from '@plugins/extension-plugin.js';
export { asHost } from '@plugins/host-slots.js';
