import * as http from 'node:http';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { closeServer, listenLocalhost } from '@plugins/transport/http/http-listen.js';
import { createHttpRegistry } from '@plugins/transport/http/registry.js';
import { createMcpSseHub } from '@plugins/transport/http/sse-hub.js';
import { handleHttpRequest } from '@plugins/transport/http/http-handler.js';
import { appPlugin } from './plugin.js';

describe('app static UI', () => {
  it('serves the built UI from staticRoot', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'app-ui-'));
    await mkdir(path.join(root, 'assets'));
    await writeFile(path.join(root, 'index.html'), '<!doctype html><title>App</title>');
    await writeFile(path.join(root, 'assets', 'app.js'), 'console.log(1)');
    const sse = createMcpSseHub();
    const registry = createHttpRegistry();
    appPlugin({
      runtime: { cwd: root, log: () => {} },
      options: { staticRoot: root },
    }).contributeHttp!(registry, { cwd: root, log: () => {}, extras: {}, pluginName: 'app' });
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
    try {
      expect(await (await fetch(`http://127.0.0.1:${port}/`)).text()).toContain('App');
      expect(await (await fetch(`http://127.0.0.1:${port}/assets/app.js`)).text()).toBe('console.log(1)');
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
