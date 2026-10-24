import type { PluginInit } from '@buildautomaton/runtime';
import type { ExtensionPlugin } from '@plugins/extension-plugin.js';
import type { ToolsImplementation } from '@plugins/tools/tools/implementation.js';
import { createWorkflowBook, type WorkflowStage } from './book.js';
import { callWorkflowTool, WORKFLOW_INSTRUCTIONS, WORKFLOW_TOOL } from './tools.js';

export type WorkflowOptions = { workflows?: WorkflowStage[] };

const tools: ToolsImplementation = {
  listTools: () => [WORKFLOW_TOOL],
  callTool: async (name, args, ctx) => {
    if (name !== 'get_workflow') return { content: [{ type: 'text', text: `Unknown workflow tool: ${name}` }], isError: true };
    return callWorkflowTool(args, ctx);
  },
  instructions: () => WORKFLOW_INSTRUCTIONS,
};

export function workflowsPlugin(init: PluginInit<WorkflowOptions> = {}): ExtensionPlugin {
  const stages = init.options?.workflows ?? [];
  return {
    name: 'workflows',
    description: 'Markdown workflow stages the agent reads with get_workflow. Stages are guidance, not an executor.',
    targetRuntime: 'node',
    services: [{ id: 'workflows' }, { id: 'tools', implementation: tools }],
    options: { workflows: stages },
    createFromStores: () => createWorkflowBook(stages),
    runtime: init.runtime,
  };
}
