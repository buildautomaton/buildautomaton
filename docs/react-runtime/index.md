# @buildautomaton/ui-runtime

The React runtime (`runtimes/react`, `@buildautomaton/ui-runtime`) is the other **small runtime**, for the app screen. It starts as a React app. You pass in UI plugins and get a composed dashboard.

The ready-made [app-host](../app-host/) uses this. Apps use the **app** shell: the product in `main`. The BuildAutomaton widget floats over that shell.

```text
Your host (Vite app, or pages the runtime serves)
  → createUi({ plugins })
  → app layout
  → app in main, widget over the page
```

```ts
import { createUi, layoutPlugin } from '@buildautomaton/ui-runtime';

const { App } = createUi({ plugins: [layoutPlugin('app')] });
```

| Kind | Role |
| --- | --- |
| `provider` | Shared React context (work client, theme, …) |
| `surface` | A view in a named panel |
| `layout` | Which shell to use; the last one wins |
| `theme` | Optional; tokens live in `src/design/tokens.css` |

| Layout | Panels | When to use |
| --- | --- | --- |
| `app` | `nav`, `main` | **Apps.** Main is the app. The widget floats over it. |
| `master-detail` | `nav`, `master`, `detail` | Custom two-pane tools |
| `columns` | `nav`, `column`, `header` | Custom boards — not the buildautomaton |

Shared pieces like `Column`, `PromptComposer`, and `NumberedQuestion` live in `@buildautomaton/ui-runtime/design`.

A package can ship UI plugins only, or pair them with [runtime plugins](../plugins/). [BuildAutomaton](../work/ui.md) is the chat popup.
