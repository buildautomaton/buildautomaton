import type { McpToolCallResult } from '@plugins/work/host.js';

export function toolText(
  value: string,
  opts?: { isError?: boolean; structuredContent?: unknown },
): McpToolCallResult {
  return {
    content: [{ type: 'text', text: value }],
    ...(opts?.structuredContent !== undefined ? { structuredContent: opts.structuredContent } : {}),
    ...(opts?.isError ? { isError: true } : {}),
  };
}
