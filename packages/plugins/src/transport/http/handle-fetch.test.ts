import { describe, expect, it } from 'vitest';
import { createHttpRegistry } from './registry.js';
import { handleFetchRequest } from './handle-fetch.js';

describe('handleFetchRequest', () => {
  it('dispatches a registered JSON route', async () => {
    const http = createHttpRegistry();
    http.addRoute({
      path: '/api/ping',
      handler: (_req, res) => {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      },
    });
    const res = await handleFetchRequest(new Request('http://127.0.0.1/api/ping'), {
      path: '/mcp',
      routes: http.routes(),
      tools: { listTools: async () => [], callTool: async () => ({ content: [] }) },
      initialized: { value: false },
      log: () => {},
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('reads a JSON body', async () => {
    const http = createHttpRegistry();
    http.addRoute({
      path: '/api/echo',
      handler: async (req, res) => {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        res.writeHead(201, { 'content-type': 'application/json' });
        res.end(Buffer.concat(chunks).toString('utf8') || '{}');
      },
    });
    const res = await handleFetchRequest(
      new Request('http://127.0.0.1/api/echo', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ n: 1 }),
      }),
      {
        path: '/mcp',
        routes: http.routes(),
        tools: { listTools: async () => [], callTool: async () => ({ content: [] }) },
        initialized: { value: false },
        log: () => {},
      },
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ n: 1 });
  });
});
