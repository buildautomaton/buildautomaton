# Widgets

`widgetsPlugin` (service id `widgets`) shows app widgets inside an MCP tool result. This is not a chat popup.

```ts
import { widgetsPlugin } from '@buildautomaton/plugins';

widgetsPlugin({
  runtime,
  options: {
    widgets: [{
      id: 'board',
      title: 'Board',
      mode: 'table',
      collection: 'prospects',
      output: 'prospects',
      fields: [{ name: 'partner', type: 'string' }],
      actions: ['confirm'],
    }],
  },
})
```

A widget has an id, title, mode (`table`, `score`, `cards`, or `form`), the collection it reads, the collection it writes, optional fields, and optional mutation names.

Tool: `show_ui_widget`. Arguments can override `collection` and `outputCollection`. The result includes text, `structuredContent` (records, fields, `canSave`, and the actions this user may run), and `_meta.ui.resourceUri` of `ui://app/widget.html`.

When this plugin is loaded, MCP `initialize` advertises `resources` and `io.modelcontextprotocol/ui`. `resources/read` returns one HTML document. The frame reads `structuredContent` and saves with `run_data_store_action` `replace` on the output collection. Buttons for mutations the user cannot run are omitted. The [data store](./data-store.md) still enforces the grant.
