import type { McpResource } from '@plugins/tools/tools/definitions.js';
import { widgetFrameHtml } from './frame.js';

export const WIDGET_UI_URI = 'ui://app/widget.html';
export const WIDGET_MIME = 'text/html;profile=mcp-app';

export function widgetUiMeta(): Record<string, unknown> {
  return {
    ui: { resourceUri: WIDGET_UI_URI, visibility: ['model', 'app'] },
    'ui/resourceUri': WIDGET_UI_URI,
  };
}

export function widgetResources(): McpResource[] {
  return [
    {
      uri: WIDGET_UI_URI,
      name: 'App widget',
      description: 'Embedded collection widget',
      mimeType: WIDGET_MIME,
      text: widgetFrameHtml(),
      _meta: { ui: { prefersBorder: true } },
    },
  ];
}

export function readWidgetResource(uri: string): McpResource | null {
  if (uri !== WIDGET_UI_URI && !uri.startsWith(`${WIDGET_UI_URI}?`)) return null;
  return widgetResources()[0] ?? null;
}
