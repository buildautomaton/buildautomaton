import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.resolve(__dirname);

export default defineConfig(({ command }) => {
  const api = process.env.VITE_API_ORIGIN ?? process.env.META_HARNESS_API ?? 'http://127.0.0.1:3333';
  return {
  root,
  base: command === 'build' ? '/buildautomaton/' : '/',
  plugins: [react()],
  define:
    command === 'serve'
      ? { 'import.meta.env.VITE_API_ORIGIN': JSON.stringify(api) }
      : {},
  resolve: {
    alias: {
      '@plugins': path.resolve(root, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 5174,
    proxy: { '/api': { target: api, changeOrigin: true } },
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
  };
});
