import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell } from './shell.js';
import '@buildautomaton/ui-runtime/design/tokens.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppShell />
  </StrictMode>,
);
