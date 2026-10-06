import type { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { sqlStorePlugin, type SqlStore } from '@buildautomaton/plugins';
import { createEmailBackend } from './backend.js';
import { handleEmailHttp } from './http.js';
import { EMAIL_MIGRATIONS } from './migrations.js';

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

describe('email HTTP', () => {
  it('adds and lists messages', async () => {
    const sql = sqlStorePlugin({ options: { file: ':memory:' } }).implementation as SqlStore;
    sql.migrate('email-sql', EMAIL_MIGRATIONS);
    const mail = createEmailBackend(sql);
    const created = res();
    await handleEmailHttp(
      req('POST', '/api/emails', { fromAddr: 'a@b.c', toAddr: 'd@e.f', subject: 'Ping' }),
      created.writer,
      mail,
      '/api/emails',
    );
    expect(created.out.status).toBe(201);
    const listed = res();
    await handleEmailHttp(req('GET', '/api/emails'), listed.writer, mail, '/api/emails');
    expect(JSON.parse(listed.out.body)).toHaveLength(1);
  });
});
