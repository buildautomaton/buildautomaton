import type { ToolsPlugin, ToolsPluginInit } from '@plugins/work/host.js';
import type { ToolsImplementation } from '@plugins/work/host.js';
import { workToolDefinitions } from './definitions.js';
import {
  ASK_BUILDAUTOMATON_INTERVIEW_QUESTIONS,
  ASK_BUILDAUTOMATON_WHAT_TO_BUILD_NEXT,
  TELL_BUILDAUTOMATON_WHAT_WAS_BUILT,
} from './names.js';
import { handleAskWhatToWorkOn } from './ask-handle.js';
import { handleAskInterviewQuestions } from './interview-handle.js';
import { handleTellWhatWasBuilt } from './tell-handle.js';
import { workInstructions } from './instructions.js';
import { artifactsFrom } from './ctx.js';

export function workToolsPlugin(init: ToolsPluginInit = {}): ToolsPlugin {
  const defaults: ToolsImplementation = {
    listTools: (ctx) => workToolDefinitions(artifactsFrom(ctx)),
    callTool: async (name, args, ctx) => {
      if (name === ASK_BUILDAUTOMATON_WHAT_TO_BUILD_NEXT) return handleAskWhatToWorkOn(ctx);
      if (name === ASK_BUILDAUTOMATON_INTERVIEW_QUESTIONS) return handleAskInterviewQuestions(args, ctx);
      if (name === TELL_BUILDAUTOMATON_WHAT_WAS_BUILT) return handleTellWhatWasBuilt(args, ctx);
      return { content: [{ type: 'text', text: `Unknown buildautomaton tool: ${name}` }], isError: true };
    },
    instructions: (ctx) => workInstructions(artifactsFrom(ctx)),
  };
  const implementation = { ...defaults, ...init.implementation };
  return {
    name: 'buildautomaton-tools',
    description: 'Ask/tell MCP loop for queued build work. Use when an agent should pull work, implement it, and submit artifacts.',
    targetRuntime: 'node',
    services: [{ id: 'tools', options: init.options, hooks: init.hooks, implementation }],
    options: init.options,
    hooks: init.hooks,
    implementation,
    runtime: init.runtime,
  };
}

export const buildautomatonToolsPlugin = workToolsPlugin;
