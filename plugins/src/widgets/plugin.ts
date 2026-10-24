import type { PluginInit } from '@buildautomaton/runtime';
import type { ExtensionPlugin } from '@plugins/extension-plugin.js';
import type { ToolsImplementation } from '@plugins/tools/tools/implementation.js';
import { readWidgetResource, widgetResources, widgetUiMeta } from './resource.js';
import { showWidget } from './show.js';
import type { WidgetDef } from './types.js';

export type WidgetOptions = { widgets?: WidgetDef[] };

export function widgetsPlugin(init: PluginInit<WidgetOptions> = {}): ExtensionPlugin {
  const widgets = init.options?.widgets ?? [];
  const tools: ToolsImplementation = {
    listTools: () => [
      {
        name: 'show_ui_widget',
        description: 'Show a widget in the tool result. Hosts that support MCP Apps render it there. Do not paste a URL.',
        inputSchema: {
          type: 'object',
          properties: {
            widget: { type: 'string' },
            collection: { type: 'string' },
            outputCollection: { type: 'string' },
            fields: { type: 'array' },
            values: { type: 'object' },
          },
          required: ['widget'],
        },
        _meta: widgetUiMeta(),
      },
    ],
    callTool: (name, args, ctx) => {
      if (name !== 'show_ui_widget') {
        return Promise.resolve({ content: [{ type: 'text' as const, text: `Unknown widget tool: ${name}` }], isError: true });
      }
      return showWidget(widgets, args, ctx);
    },
    listResources: () => widgetResources(),
    readResource: (uri) => readWidgetResource(uri),
  };
  return {
    name: 'widgets',
    description: 'App widgets that read a collection and save it back through the data store. This is not a chat widget.',
    targetRuntime: 'node',
    services: [{ id: 'widgets' }, { id: 'tools', implementation: tools }],
    options: { widgets },
    createFromStores: () => ({ widgets }),
    runtime: init.runtime,
  };
}
