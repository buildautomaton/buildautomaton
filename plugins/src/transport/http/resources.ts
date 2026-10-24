import type { ToolRegistry } from '@plugins/tools/tools/implementation.js';
import { jsonRpcError, jsonRpcResult, type JsonRpcMessage } from './jsonrpc.js';

export async function listMcpResources(id: JsonRpcMessage['id'], tools: ToolRegistry): Promise<JsonRpcMessage> {
  const resources = (await tools.listResources?.()) ?? [];
  return jsonRpcResult(id, {
    resources: resources.map(({ uri, name, description, mimeType, _meta }) => ({
      uri,
      name,
      description,
      mimeType,
      _meta,
    })),
  });
}

export async function readMcpResource(
  id: JsonRpcMessage['id'],
  params: Record<string, unknown>,
  tools: ToolRegistry,
): Promise<JsonRpcMessage> {
  const uri = typeof params.uri === 'string' ? params.uri : '';
  const found = uri ? await tools.readResource?.(uri) : null;
  if (!found) return jsonRpcError(id, -32002, `Resource not found: ${uri}`);
  return jsonRpcResult(id, {
    contents: [{ uri: found.uri, mimeType: found.mimeType, text: found.text ?? '', _meta: found._meta }],
  });
}
