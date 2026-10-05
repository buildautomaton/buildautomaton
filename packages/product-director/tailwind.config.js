import ui from '../ui/tailwind.config.js';

export default {
  ...ui,
  content: [
    './widget.html',
    './app.html',
    './src/app/**/*.{ts,tsx}',
    './src/plugins/ui/**/*.{ts,tsx}',
    './src/widget/**/*.{ts,tsx}',
    '../ui-runtime/src/**/*.{ts,tsx}',
  ],
};
