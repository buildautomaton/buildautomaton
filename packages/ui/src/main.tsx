import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createAppUi } from '@buildautomaton/product-director/ui';
import '@buildautomaton/ui-runtime/design/tokens.css';

const { App } = createAppUi();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
