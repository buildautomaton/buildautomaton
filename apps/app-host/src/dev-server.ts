import { join } from 'node:path';
import { createServer } from 'vite';
import { uiRootDir } from './paths.js';

export type UiDevHost = {
  url: string;
  close: () => Promise<void>;
};

export async function startUiDev(opts: { apiPort: number; port?: number }): Promise<UiDevHost> {
  const api = `http://127.0.0.1:${opts.apiPort}`;
  process.env.META_HARNESS_API = api;
  process.env.VITE_API_ORIGIN = api;
  const port = opts.port ?? 5173;
  const server = await createServer({
    root: uiRootDir(),
    configFile: join(uiRootDir(), 'vite.config.ts'),
    define: { 'import.meta.env.VITE_API_ORIGIN': JSON.stringify(api) },
    server: {
      port,
      strictPort: true,
      proxy: {
        '/api': { target: api, changeOrigin: true },
        '/buildautomaton': { target: api, changeOrigin: true },
      },
    },
  });
  await server.listen();
  const url = server.resolvedUrls?.local[0] ?? `http://127.0.0.1:${port}/`;
  return { url, close: () => server.close() };
}
