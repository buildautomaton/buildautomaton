import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createHostUi } from './host-ui.js';
import '@buildautomaton/ui-runtime/design/tokens.css';

const { App } = createHostUi();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
