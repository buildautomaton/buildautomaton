import type { ReactNode } from 'react';
import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { LiveProvider } from '@plugins/live/ui/context.js';
import { WorkProvider } from '../board/context.js';
import type { WorkClient } from '../board/types.js';
function bindProvider(client?: WorkClient) {
  return function WorkBoundProvider({ children }: { children: ReactNode }) {
    return (
      <LiveProvider>
        <WorkProvider client={client}>{children}</WorkProvider>
      </LiveProvider>
    );
  };
}

export function widgetUiPlugin(client?: WorkClient): UiPlugin {
  return {
    name: 'buildautomaton-widget',
    description: 'Work and live providers. The chat popup is not mounted.',
    targetRuntime: 'react',
    implementation: {
      providers: [{ id: 'work', component: bindProvider(client) }],
    },
  };
}
