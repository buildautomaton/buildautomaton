import type { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from '@buildautomaton/runtime';
import { createMarketplaceBackend } from './backend.js';
import { handleMarketplaceHttp } from './http.js';
import { MARKETPLACE_MIGRATIONS } from './migrations.js';

function req(method: string, url: string, body?: unknown): IncomingMessage {
  const stream = Readable.from([body === undefined ? Buffer.alloc(0) : Buffer.from(JSON.stringify(body))]);
  return Object.assign(stream, { method, url }) as IncomingMessage;
}

function res() {
  const out = { status: 0, body: '' };
  const writer = {
    writeHead(status: number) {
      out.status = status;
    },
    end(chunk?: string) {
      out.body = chunk ?? '';
    },
  } as ServerResponse;
  return { writer, out };
}

describe('marketplace HTTP', () => {
  it('lists and returns a seeded plugin', async () => {
    const sql = sqlStorePlugin({ options: { file: ':memory:' } }).implementation;
    sql.migrate('marketplace-sql', MARKETPLACE_MIGRATIONS);
    const market = createMarketplaceBackend(sql);
    const listed = res();
    await handleMarketplaceHttp(req('GET', '/api/marketplace?kind=plugin'), listed.writer, market, '/api/marketplace');
    expect(JSON.parse(listed.out.body).length).toBeGreaterThan(0);
    const one = res();
    await handleMarketplaceHttp(req('GET', '/api/marketplace/email'), one.writer, market, '/api/marketplace/email');
    expect(JSON.parse(one.out.body).slug).toBe('email');
  });
});
