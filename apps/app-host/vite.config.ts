import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteApiDefine, viteApiOrigin } from './src/vite-api.js';

const root = path.resolve(__dirname);

export default defineConfig(({ command }) => {
  const api = viteApiOrigin(command) ?? 'http://127.0.0.1:3333';
  return {
    root,
    plugins: [react()],
    define: viteApiDefine(command),
    resolve: {
      alias: {
        '@plugins': path.resolve(root, '../../plugins/src'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: api, changeOrigin: true },
        '/buildautomaton': { target: api, changeOrigin: true },
      },
      fs: { allow: [path.resolve(root, '../..')] },
    },
    build: { outDir: 'dist' },
  };
});
