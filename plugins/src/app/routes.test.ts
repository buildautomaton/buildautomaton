import * as http from 'node:http';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { closeServer, listenLocalhost } from '@plugins/transport/http/http-listen.js';
import { handleHttpRequest } from '@plugins/transport/http/http-handler.js';
import { createHttpRegistry } from '@plugins/transport/http/registry.js';
import { createMcpSseHub } from '@plugins/transport/http/sse-hub.js';
import { appPlugin } from './plugin.js';
import { APP_HOME } from './routes.js';

describe('app routes', () => {
  it('redirects home and transforms on the first prompt', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'app-http-'));
    const sse = createMcpSseHub();
    const registry = createHttpRegistry();
    appPlugin({ runtime: { cwd, log: () => {} } }).contributeHttp!(registry, {
      cwd,
      log: () => {},
      extras: {},
      pluginName: 'app',
    });
    const server = http.createServer((req, res) => {
      void handleHttpRequest(req, res, {
        path: '/mcp',
        tools: { listTools: async () => [], callTool: async () => ({ content: [] }) },
        initialized: { value: false },
        log: () => {},
        sse,
        routes: registry.routes(),
      });
    });
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    const base = `http://127.0.0.1:${port}`;
    try {
      const home = await fetch(`${base}/`, { redirect: 'manual' });
      expect(home.status).toBe(302);
      expect(home.headers.get('location')).toBe(APP_HOME);
      expect(await (await fetch(`${base}/api/app`)).json()).toEqual({ phase: 'prompt', prompt: null });
      const started = await fetch(`${base}/api/app`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: 'A reading list' }),
      });
      expect(started.status).toBe(200);
      expect(await started.json()).toEqual({ phase: 'transformed', prompt: 'A reading list' });
      const again = await fetch(`${base}/api/app`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: 'Nope' }),
      });
      expect(again.status).toBe(409);
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
