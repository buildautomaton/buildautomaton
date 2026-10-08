import type { ReactNode } from 'react';
import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { WorkProvider } from '../board/context.js';
import type { WorkClient } from '../board/types.js';
import { ChatWidget } from './chat-widget.js';

function bindProvider(client?: WorkClient) {
  return function WorkBoundProvider({ children }: { children: ReactNode }) {
    return (
      <WorkProvider client={client}>
        {children}
        <ChatWidget />
      </WorkProvider>
    );
  };
}

export function widgetUiPlugin(client?: WorkClient): UiPlugin {
  return {
    name: 'buildautomaton-widget',
    description: 'BuildAutomaton chat widget: circle button, disk sessions, and setup. Opens in a popup over the app.',
    targetRuntime: 'react',
    implementation: {
      providers: [{ id: 'work', component: bindProvider(client) }],
    },
  };
}
