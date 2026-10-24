import type { McpToolCallResult } from '@plugins/tools/tools/definitions.js';
import type { ToolContext } from '@plugins/tools/tools/implementation.js';
import type { DataStore } from '@plugins/data-store/open.js';
import { gateFrom } from '@plugins/data-store/gate.js';
import type { WidgetDef } from './types.js';
import { widgetUiMeta } from './resource.js';

export async function showWidget(widgets: WidgetDef[], args: Record<string, unknown>, ctx: ToolContext): Promise<McpToolCallResult> {
  const id = typeof args.widget === 'string' ? args.widget : '';
  const widget = widgets.find((item) => item.id === id);
  if (!widget) {
    const ids = widgets.map((item) => item.id).join(', ') || 'none';
    return { content: [{ type: 'text', text: `Unknown widget: ${id || '(missing)'}. Widgets: ${ids}` }], isError: true };
  }
  const collection = stringArg(args.collection) || widget.collection;
  const output = stringArg(args.outputCollection) || widget.output;
  const records = await readRecords(ctx, collection);
  const gate = gateFrom(ctx.extras);
  const canSave = await gate.can('replace', output);
  const actions = [];
  for (const action of widget.actions ?? []) {
    if (await gate.can(action, output)) actions.push(action);
  }
  const fields = widget.fields ?? [];
  const text = `${widget.title} is in the tool result. Do not paste a URL. After a save, list ${output}.`;
  return {
    content: [{ type: 'text', text }],
    structuredContent: {
      widget: widget.id,
      mode: widget.mode,
      collection,
      output,
      records,
      fields,
      canSave,
      actions,
    },
    _meta: widgetUiMeta(),
  };
}

async function readRecords(ctx: ToolContext, collection: string): Promise<Record<string, unknown>[]> {
  const store = ctx.extras['data-store'] as DataStore | undefined;
  if (!store || !collection) return [];
  const listed = await store.apply({ action: 'list', collection });
  return listed.ok && listed.records ? listed.records : [];
}

function stringArg(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}
