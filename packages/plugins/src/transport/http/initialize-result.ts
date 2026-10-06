import { MCP_SERVER_NAME, RUNTIME_VERSION } from '@buildautomaton/runtime';
import { jsonRpcResult, type JsonRpcMessage } from './jsonrpc.js';

export const MCP_PROTOCOL_VERSION = '2025-03-26';
export { MCP_SERVER_NAME };

export function mcpInitializeResult(
  id: JsonRpcMessage['id'],
  instructions?: string,
): JsonRpcMessage {
  return jsonRpcResult(id, {
    protocolVersion: MCP_PROTOCOL_VERSION,
    capabilities: { tools: {}, logging: {}, prompts: {} },
    serverInfo: { name: MCP_SERVER_NAME, version: RUNTIME_VERSION },
    ...(instructions ? { instructions } : {}),
  });
}
