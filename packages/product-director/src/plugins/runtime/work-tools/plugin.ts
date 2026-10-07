import type { ToolsPlugin, ToolsPluginInit } from '@buildautomaton/plugins';
import type { ToolsImplementation } from '@buildautomaton/plugins';
import { workToolDefinitions } from './definitions.js';
import {
  ASK_PRODUCT_DIRECTOR_INTERVIEW_QUESTIONS,
  ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT,
  TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT,
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
      if (name === ASK_PRODUCT_DIRECTOR_WHAT_TO_BUILD_NEXT) return handleAskWhatToWorkOn(ctx);
      if (name === ASK_PRODUCT_DIRECTOR_INTERVIEW_QUESTIONS) return handleAskInterviewQuestions(args, ctx);
      if (name === TELL_PRODUCT_DIRECTOR_WHAT_WAS_BUILT) return handleTellWhatWasBuilt(args, ctx);
      return { content: [{ type: 'text', text: `Unknown product director tool: ${name}` }], isError: true };
    },
    instructions: (ctx) => workInstructions(artifactsFrom(ctx)),
  };
  const implementation = { ...defaults, ...init.implementation };
  return {
    name: 'product-director-tools',
    services: [{ id: 'tools', options: init.options, hooks: init.hooks, implementation }],
    options: init.options,
    hooks: init.hooks,
    implementation,
    runtime: init.runtime,
  };
}

export const productDirectorToolsPlugin = workToolsPlugin;
