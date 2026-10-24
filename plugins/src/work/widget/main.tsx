import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LiveProvider } from '@plugins/live/ui/context.js';
import { WorkProvider } from '@plugins/work/board/context.js';
import { WidgetShell } from './widget-shell.js';
import '@buildautomaton/ui-runtime/design/tokens.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LiveProvider>
      <WorkProvider>
        <WidgetShell />
      </WorkProvider>
    </LiveProvider>
  </StrictMode>,
);
