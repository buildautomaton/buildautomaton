import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { MCP_CORS } from '@plugins/transport/http/cors.js';

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

export async function serveStatic(
  req: IncomingMessage,
  res: ServerResponse,
  root: string,
  pathname: string,
): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { ...MCP_CORS, 'content-type': 'text/plain; charset=utf-8' });
    res.end('Method not allowed');
    return;
  }
  const file = resolveFile(root, pathname);
  if (!file) {
    res.writeHead(403, { ...MCP_CORS, 'content-type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }
  try {
    const body = await readFile((await stat(file)).isFile() ? file : path.join(root, 'index.html'));
    const type = TYPES[path.extname(file)] ?? 'text/html; charset=utf-8';
    res.writeHead(200, { ...MCP_CORS, 'content-type': type, 'cache-control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    try {
      const fallback = await readFile(path.join(root, 'index.html'));
      res.writeHead(200, { ...MCP_CORS, 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : fallback);
    } catch {
      res.writeHead(404, { ...MCP_CORS, 'content-type': 'text/plain; charset=utf-8' });
      res.end('UI bundle missing. Run pnpm --filter @buildautomaton/app-host build.');
    }
  }
}

function resolveFile(root: string, pathname: string): string | null {
  const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, rel);
  const base = path.resolve(root);
  if (file !== base && !file.startsWith(`${base}${path.sep}`)) return null;
  return file;
}
