import type { McpToolCallResult } from '@buildautomaton/plugins';

export function toolJson(value: unknown, isError = false): McpToolCallResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    structuredContent: value,
    ...(isError ? { isError: true } : {}),
  };
}

export const NO_MARKET = toolJson({ error: 'Marketplace backend is not available.' }, true);
