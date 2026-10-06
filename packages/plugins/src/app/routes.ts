import type { IncomingMessage, ServerResponse } from 'node:http';
import type { HttpRegistry } from '@plugins/transport/http/types/registry.js';
import { MCP_CORS } from '@plugins/transport/http/cors.js';
import { readRequestBody } from '@plugins/transport/http/http-read-body.js';
import { commitAppPrompt, readAppState, type AppState } from './state.js';
import { serveStatic } from './serve-static.js';

export const APP_HOME = '/director/app.html';

export function contributeAppRoutes(http: HttpRegistry, cwd: string, staticRoot?: string): void {
  http.addRoute({ path: '/api/app', handler: (req, res) => handleApp(req, res, cwd) });
  http.addRoute({
    path: '/',
    handler: (req, res, hit) =>
      staticRoot ? serveStatic(req, res, staticRoot, hit.pathname) : handleHome(req, res),
  });
}

async function handleApp(req: IncomingMessage, res: ServerResponse, cwd: string): Promise<void> {
  if (req.method === 'GET') {
    send(res, 200, await readAppState(cwd));
    return;
  }
  if (req.method !== 'POST') {
    send(res, 405, { error: 'Method not allowed' });
    return;
  }
  const body = await readBody(req);
  if (!body) {
    send(res, 400, { error: 'Expected JSON' });
    return;
  }
  const result = await commitAppPrompt(cwd, typeof body.prompt === 'string' ? body.prompt : '');
  if ('error' in result && result.error === 'empty') {
    send(res, 400, { error: 'A prompt is required.' });
    return;
  }
  if ('error' in result) {
    send(res, 409, { error: 'This app already started from a prompt.' });
    return;
  }
  send(res, 200, result);
}

function handleHome(req: IncomingMessage, res: ServerResponse): void {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, { error: 'Method not allowed' });
    return;
  }
  res.writeHead(302, { ...MCP_CORS, location: APP_HOME, 'cache-control': 'no-store' });
  res.end();
}

async function readBody(req: IncomingMessage): Promise<{ prompt?: unknown } | null> {
  try {
    const raw = await readRequestBody(req);
    return (raw ? JSON.parse(raw) : {}) as { prompt?: unknown };
  } catch {
    return null;
  }
}

function send(res: ServerResponse, status: number, body: AppState | { error: string }): void {
  res.writeHead(status, {
    ...MCP_CORS,
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(body));
}
