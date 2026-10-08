import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.resolve(__dirname);

export default defineConfig(({ command }) => ({
  root,
  base: command === 'build' ? '/buildautomaton/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@plugins': path.resolve(root, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5174,
    proxy: { '/api': { target: process.env.META_HARNESS_API ?? 'http://127.0.0.1:3333', ws: true } },
    fs: { allow: [path.resolve(root, '..')] },
  },
  build: {
    outDir: 'dist/widget',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        widget: path.resolve(root, 'widget.html'),
        app: path.resolve(root, 'app.html'),
      },
    },
  },
}));
