import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { MCP_CORS } from './cors.js';
import { directorScript } from './director-script.js';
import { widgetFile } from './widget-file.js';
import { widgetRoot } from './widget-root.js';

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const MISSING_HTML =
  '<!doctype html><meta charset="utf-8"><title>Product director</title><p>Widget bundle missing. Run <code>pnpm --filter @buildautomaton/product-director build:widget</code>.</p>';

export function sendDirectorScript(req: IncomingMessage, res: ServerResponse): void {
  if (!isRead(req, res)) return;
  send(req, res, 200, 'text/javascript; charset=utf-8', directorScript());
}

export async function sendWidgetAsset(req: IncomingMessage, res: ServerResponse, pathname: string): Promise<void> {
  if (!isRead(req, res)) return;
  const file = widgetFile(widgetRoot(), pathname);
  if (!file) {
    send(req, res, 404, 'text/plain; charset=utf-8', 'Not found');
    return;
  }
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('missing');
    const body = await readFile(file);
    const type = TYPES[path.extname(file)] ?? 'application/octet-stream';
    res.writeHead(200, headers(type));
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    const page = pathname === '/director' || pathname === '/director/' || pathname === '/director/app.html';
    send(req, res, 404, page ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8', page ? MISSING_HTML : 'Not found');
  }
}

function isRead(req: IncomingMessage, res: ServerResponse): boolean {
  if (req.method === 'GET' || req.method === 'HEAD') return true;
  send(req, res, 405, 'text/plain; charset=utf-8', 'Method not allowed');
  return false;
}

function send(req: IncomingMessage, res: ServerResponse, status: number, type: string, body: string): void {
  res.writeHead(status, headers(type));
  res.end(req.method === 'HEAD' ? undefined : body);
}

function headers(type: string): Record<string, string> {
  return { ...MCP_CORS, 'content-type': type, 'cache-control': 'no-store' };
}
