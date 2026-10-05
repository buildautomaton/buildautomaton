import type { ToolsImplementation, ToolsPlugin, ToolsPluginInit } from '@buildautomaton/runtime';
import { MARKETPLACE_TOOL_DEFINITIONS } from './definitions.js';
import { handleGetListing, handleGetSource } from './handle-get.js';
import { handlePublishMarketplace } from './handle-publish.js';
import { handleListMarketplace, handleSearchMarketplace } from './handle-search.js';
import { MARKETPLACE_INSTRUCTIONS } from './instructions.js';
import {
  GET_MARKETPLACE_LISTING,
  GET_MARKETPLACE_SOURCE,
  LIST_MARKETPLACE,
  PUBLISH_MARKETPLACE,
  SEARCH_MARKETPLACE,
} from './names.js';

export function marketplaceToolsPlugin(init: ToolsPluginInit = {}): ToolsPlugin {
  const defaults: ToolsImplementation = {
    listTools: () => MARKETPLACE_TOOL_DEFINITIONS,
    callTool: async (name, args, ctx) => {
      if (name === SEARCH_MARKETPLACE) return handleSearchMarketplace(args, ctx);
      if (name === LIST_MARKETPLACE) return handleListMarketplace(args, ctx);
      if (name === GET_MARKETPLACE_LISTING) return handleGetListing(args, ctx);
      if (name === GET_MARKETPLACE_SOURCE) return handleGetSource(args, ctx);
      if (name === PUBLISH_MARKETPLACE) return handlePublishMarketplace(args, ctx);
      return { content: [{ type: 'text', text: `Unknown marketplace tool: ${name}` }], isError: true };
    },
    instructions: () => MARKETPLACE_INSTRUCTIONS,
  };
  return {
    name: 'marketplace-tools',
    kind: 'tools',
    options: init.options,
    hooks: init.hooks,
    implementation: { ...defaults, ...init.implementation },
    runtime: init.runtime,
  };
}
