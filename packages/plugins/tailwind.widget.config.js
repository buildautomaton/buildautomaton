import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ui from '../ui/tailwind.config.js';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default {
  ...ui,
  content: [
    path.join(dir, 'widget.html'),
    path.join(dir, 'app.html'),
    path.join(dir, 'src/buildautomaton/**/*.{ts,tsx}'),
    path.join(dir, '../ui-runtime/src/**/*.{ts,tsx}'),
  ],
};
