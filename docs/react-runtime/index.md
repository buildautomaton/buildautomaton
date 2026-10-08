# @buildautomaton/ui-runtime

The React runtime (`runtimes/react`, `@buildautomaton/ui-runtime`) is the other **small runtime**, for the app screen. It starts as a React app. You pass in UI plugins and get a composed dashboard.

The ready-made [UI](../ui/) host uses this. Apps always use the **sidebar** shell: the app in `main`, widgets in `sidebar`.

```text
Your host (Vite app, or pages the runtime serves)
  → createUi({ plugins })
  → sidebar layout
  → app in main, widgets in sidebar
```

```ts
import { createUi, layoutPlugin } from '@buildautomaton/ui-runtime';

const { App } = createUi({ plugins: [layoutPlugin('sidebar')] });
```

| Kind | Role |
| --- | --- |
| `provider` | Shared React context (work client, theme, …) |
| `surface` | A view in a named panel |
| `layout` | Which shell to use; the last one wins |
| `theme` | Optional; tokens live in `src/design/tokens.css` |

| Layout | Panels | When to use |
| --- | --- | --- |
| `sidebar` | `nav`, `sidebar`, `main` | **Apps.** Main is the app; sidebar is the widget. |
| `master-detail` | `nav`, `master`, `detail` | Custom two-pane tools |
| `columns` | `nav`, `column`, `header` | Custom boards — not the buildautomaton |

Shared pieces like `Column`, `PromptComposer`, and `NumberedQuestion` live in `@buildautomaton/ui-runtime/design`.

A package can ship UI plugins only, or pair them with [runtime plugins](../plugins/). [Buildautomaton](../buildautomaton/ui.md) is the sidebar widget.
