import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.resolve(__dirname);

export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    alias: {
      '@plugins': path.resolve(root, '../plugins/src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: process.env.META_HARNESS_API ?? 'http://127.0.0.1:3333' },
      '/buildautomaton': { target: process.env.META_HARNESS_API ?? 'http://127.0.0.1:3333' },
    },
    fs: { allow: [path.resolve(root, '..')] },
  },
  build: { outDir: 'dist' },
});
