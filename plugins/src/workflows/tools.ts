import { jsonToolResult } from '@plugins/tools/minion/json-result.js';
import type { McpToolCallResult, McpToolDefinition } from '@plugins/tools/tools/definitions.js';
import type { ToolContext } from '@plugins/tools/tools/implementation.js';
import type { WorkflowBook } from './book.js';

export const WORKFLOW_TOOL: McpToolDefinition = {
  name: 'get_workflow',
  description: 'Markdown for this app. Pass id for one stage. Omit id for the full workflow.',
  inputSchema: {
    type: 'object',
    properties: { id: { type: 'string', description: 'Stage id from the workflow overview' } },
  },
};

export const WORKFLOW_INSTRUCTIONS =
  'Call get_workflow before you use the data store or widgets. Omit id for the overview.';

export function callWorkflowTool(args: Record<string, unknown>, ctx: ToolContext): McpToolCallResult {
  const book = ctx.extras.workflows as WorkflowBook | undefined;
  if (!book) return jsonToolResult({ ok: false, error: 'Workflows are not ready' }, true);
  const id = typeof args.id === 'string' ? args.id : undefined;
  return { content: [{ type: 'text', text: book.get(id) }] };
}
