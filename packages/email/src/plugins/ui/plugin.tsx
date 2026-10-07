import type { UiPlugin } from '@buildautomaton/ui-runtime';
import { EmailInbox } from './inbox.js';

export function emailUiPlugin(): UiPlugin {
  return {
    name: 'email',
    implementation: {
      surfaces: [{ id: 'email-inbox', title: 'Mail', panel: 'main', order: 0, component: EmailInbox }],
    },
  };
}
