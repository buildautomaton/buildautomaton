import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createEmailUi } from '@buildautomaton/email/ui';
import '@buildautomaton/ui-runtime/design/tokens.css';

const { App } = createEmailUi();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
