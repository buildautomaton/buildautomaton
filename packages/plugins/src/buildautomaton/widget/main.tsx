import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WorkProvider } from '@plugins/buildautomaton/plugins/ui/work/context.js';
import { WidgetShell } from '@plugins/buildautomaton/plugins/ui/widget/widget-shell.js';
import '@buildautomaton/ui-runtime/design/tokens.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorkProvider>
      <WidgetShell />
    </WorkProvider>
  </StrictMode>,
);
