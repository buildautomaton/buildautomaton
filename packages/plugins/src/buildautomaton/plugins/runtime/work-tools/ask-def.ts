import type { McpToolDefinition } from '@plugins/buildautomaton/host.js';
import { ASK_BUILDAUTOMATON_WHAT_TO_BUILD_NEXT } from './names.js';
import { ASK_BUILDAUTOMATON_WHAT_TO_BUILD_NEXT_DESCRIPTION } from './descriptions.js';
import { ASK_OUTPUT_SCHEMA } from './session-schemas.js';

export const ASK_BUILDAUTOMATON_WHAT_TO_BUILD_NEXT_DEFINITION: McpToolDefinition = {
  name: ASK_BUILDAUTOMATON_WHAT_TO_BUILD_NEXT,
  title: 'Ask the buildautomaton what to build next',
  description: ASK_BUILDAUTOMATON_WHAT_TO_BUILD_NEXT_DESCRIPTION,
  inputSchema: { type: 'object', additionalProperties: false, properties: {} },
  outputSchema: ASK_OUTPUT_SCHEMA,
};
