import { describe, expect, it } from 'vitest';
import { handleMcpMethod } from '@plugins/transport/http/methods.js';
import type { ToolRegistry, ToolsImplementation } from '@plugins/tools/tools/implementation.js';
import { widgetFrameHtml } from './frame.js';
import { widgetsPlugin } from './plugin.js';
import { WIDGET_UI_URI } from './resource.js';
import { showWidget } from './show.js';

describe('widgets', () => {
  it('returns widget metadata and hides a mutation the user cannot run', async () => {
    const result = await showWidget(
      [{ id: 'board', title: 'Board', mode: 'table', collection: 'prospects', output: 'prospects', actions: ['confirm', 'record'] }],
      { widget: 'board' },
      {
        extras: {
          security: {
            allow: async () => ({ ok: true as const }),
            filter: async (_collection: string, rows: Record<string, unknown>[]) => rows,
            can: async (action: string) => action === 'confirm' || action === 'replace',
          },
          'data-store': {
            apply: async () => ({ ok: true as const, records: [{ id: '1', partner: 'Ada' }] }),
            mutate: async () => ({ ok: true as const }),
          },
        },
      } as never,
    );
    expect(result._meta).toMatchObject({ ui: { resourceUri: WIDGET_UI_URI } });
    expect(result.structuredContent).toMatchObject({ widget: 'board', actions: ['confirm'], canSave: true });
    expect(widgetFrameHtml()).toContain('run_data_store_action');
  });

  it('advertises the MCP app resource', async () => {
    const tools = widgetsPlugin().services?.find((service) => service.id === 'tools')?.implementation as ToolsImplementation;
    const reply = await handleMcpMethod(
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      widgetRegistry(tools),
      { value: false },
    );
    expect(reply?.result).toMatchObject({
      capabilities: { resources: {}, extensions: { 'io.modelcontextprotocol/ui': { mimeTypes: ['text/html;profile=mcp-app'] } } },
    });
    const read = await handleMcpMethod(
      { jsonrpc: '2.0', id: 2, method: 'resources/read', params: { uri: WIDGET_UI_URI } },
      widgetRegistry(tools),
      { value: true },
    );
    expect(JSON.stringify(read?.result)).toContain('Save');
  });
});

function widgetRegistry(tools: ToolsImplementation): ToolRegistry {
  return {
    listTools: async () => [],
    callTool: async () => ({ content: [] }),
    listResources: () => tools.listResources?.({} as never) ?? [],
    readResource: (uri) => tools.readResource?.(uri, {} as never) ?? null,
  };
}
