import type { ReactNode } from 'react';
import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { WorkProvider } from '../work/context.js';
import type { WorkClient } from '../work/types.js';
import { WidgetShell } from './widget-shell.js';

function bindProvider(client?: WorkClient) {
  return function WorkBoundProvider({ children }: { children: ReactNode }) {
    return <WorkProvider client={client}>{children}</WorkProvider>;
  };
}

export function widgetUiPlugin(client?: WorkClient): UiPlugin {
  return {
    name: 'director-widget',
    kind: 'surface',
    implementation: {
      layout: 'sidebar',
      providers: [{ id: 'work', component: bindProvider(client) }],
      surfaces: [
        {
          id: 'director-widget',
          title: 'Product director',
          panel: 'sidebar',
          order: 0,
          component: WidgetShell,
        },
      ],
    },
  };
}
