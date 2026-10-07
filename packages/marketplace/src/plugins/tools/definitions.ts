import type { McpToolDefinition } from '@buildautomaton/plugins';
import {
  GET_MARKETPLACE_LISTING,
  GET_MARKETPLACE_SOURCE,
  LIST_MARKETPLACE,
  PUBLISH_MARKETPLACE,
  SEARCH_MARKETPLACE,
} from './names.js';

const kindProp = { type: 'string', enum: ['plugin', 'app'] };

export const MARKETPLACE_TOOL_DEFINITIONS: McpToolDefinition[] = [
  {
    name: SEARCH_MARKETPLACE,
    description: 'Semantic search for marketplace plugins and app compositions by a prompt or phrase.',
    inputSchema: {
      type: 'object',
      required: ['query'],
      properties: { query: { type: 'string' }, kind: kindProp },
    },
  },
  {
    name: GET_MARKETPLACE_LISTING,
    description: 'Get one listing: markdown description, director artifacts, and metadata.',
    inputSchema: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
  },
  {
    name: LIST_MARKETPLACE,
    description: 'Browse marketplace listings without a semantic query.',
    inputSchema: { type: 'object', properties: { kind: kindProp } },
  },
  {
    name: GET_MARKETPLACE_SOURCE,
    description: 'Read stored source files for a listing. Omit path to list the tree.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'string' }, path: { type: 'string' } },
    },
  },
  {
    name: PUBLISH_MARKETPLACE,
    description: 'Publish a plugin or app with markdown, director artifacts, and source.',
    inputSchema: {
      type: 'object',
      required: ['kind', 'slug', 'name'],
      properties: {
        kind: kindProp,
        slug: { type: 'string' },
        name: { type: 'string' },
        summary: { type: 'string' },
        description: { type: 'string' },
        plugins: { type: 'array', items: { type: 'string' } },
        artifacts: { type: 'array' },
        source: { type: 'array' },
      },
    },
  },
];
