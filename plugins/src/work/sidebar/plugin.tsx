import type { ReactNode } from 'react';
import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { WorkProvider } from '../board/context.js';
import type { WorkClient } from '../board/types.js';
import { WidgetShell } from './widget-shell.js';

function bindProvider(client?: WorkClient) {
  return function WorkBoundProvider({ children }: { children: ReactNode }) {
    return <WorkProvider client={client}>{children}</WorkProvider>;
  };
}

export function widgetUiPlugin(client?: WorkClient): UiPlugin {
  return {
    name: 'buildautomaton-widget',
    description: 'BuildAutomaton sidebar widget: queue, reviews, and agent setup. Use beside a running app.',
    targetRuntime: 'react',
    implementation: {
      layout: 'sidebar',
      providers: [{ id: 'work', component: bindProvider(client) }],
      surfaces: [
        {
          id: 'buildautomaton-widget',
          title: 'BuildAutomaton',
          panel: 'sidebar',
          order: 0,
          component: WidgetShell,
        },
      ],
    },
  };
}
