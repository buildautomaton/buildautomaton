import { jsonToolResult } from '@plugins/tools/minion/json-result.js';
import type { McpToolCallResult, McpToolDefinition } from '@plugins/tools/tools/definitions.js';
import type { ToolContext } from '@plugins/tools/tools/implementation.js';
import type { ActionInput } from './types.js';
import type { DataStore } from './open.js';

export const DATA_STORE_TOOLS: McpToolDefinition[] = [
  {
    name: 'run_data_store_action',
    description:
      'Run an action on a named collection. Actions: define, insert, upsert, replace, update, remove, get, list, query, count, clear, score, collections.',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string' },
        collection: { type: 'string' },
        typeName: { type: 'string' },
        fields: { type: 'array' },
        records: { type: 'array' },
        record: { type: 'object' },
        id: { type: 'string' },
        patch: { type: 'object' },
        where: { type: 'object' },
        scoreFields: { type: 'array' },
        high: { type: 'number' },
        mid: { type: 'number' },
      },
      required: ['action'],
    },
  },
  {
    name: 'run_mutation',
    description: 'Run a named data store mutation for the signed-in user. Pass action and args.',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string' },
        args: { type: 'object' },
      },
      required: ['action'],
    },
  },
];

export async function callDataStoreTool(
  name: string,
  args: Record<string, unknown>,
  ctx: ToolContext,
): Promise<McpToolCallResult> {
  const store = ctx.extras['data-store'] as DataStore | undefined;
  if (!store) return jsonToolResult({ ok: false, error: 'Data store is not ready' }, true);
  if (name === 'run_data_store_action') {
    const result = await store.apply(args as ActionInput);
    return jsonToolResult(result, !result.ok);
  }
  if (name === 'run_mutation') {
    const action = typeof args.action === 'string' ? args.action : '';
    const nested = args.args && typeof args.args === 'object' ? (args.args as Record<string, unknown>) : {};
    const result = await store.mutate(action, nested);
    return jsonToolResult(result, !result.ok);
  }
  return jsonToolResult({ ok: false, error: `Unknown data store tool: ${name}` }, true);
}
