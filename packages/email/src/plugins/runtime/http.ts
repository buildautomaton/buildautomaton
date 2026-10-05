import type { IncomingMessage, ServerResponse } from 'node:http';
import type { EmailFolder } from '../../types/email.js';
import type { EmailImplementation } from '../../types/implementation.js';
import { writeJson, readJson } from './http-io.js';
import { parseAdd, parsePatch } from './http-parse.js';
import { asFolder } from './rows.js';

export async function handleEmailHttp(
  req: IncomingMessage,
  res: ServerResponse,
  emails: EmailImplementation,
  pathname: string,
): Promise<void> {
  const rest = pathname.replace(/^\/api\/emails\/?/, '');
  const method = req.method ?? 'GET';
  if (!rest) return handleCollection(req, res, emails, method);
  if (method === 'GET') {
    const found = emails.getEmail(rest);
    writeJson(res, found ? 200 : 404, found ?? { error: 'Not found' });
    return;
  }
  if (method === 'PATCH') {
    const body = parsePatch(await readJson(req));
    if ('error' in body) return writeJson(res, 400, body);
    const next = emails.updateEmail(rest, body);
    writeJson(res, next ? 200 : 404, next ?? { error: 'Not found' });
    return;
  }
  if (method === 'DELETE') {
    const ok = emails.deleteEmail(rest);
    writeJson(res, ok ? 204 : 404, ok ? null : { error: 'Not found' });
    return;
  }
  writeJson(res, 405, { error: 'Method not allowed' });
}

async function handleCollection(
  req: IncomingMessage,
  res: ServerResponse,
  emails: EmailImplementation,
  method: string,
): Promise<void> {
  if (method === 'GET') {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const folder = url.searchParams.get('folder');
    writeJson(res, 200, emails.listEmails(folder ? asFolder(folder) : undefined));
    return;
  }
  if (method !== 'POST') {
    writeJson(res, 405, { error: 'Method not allowed' });
    return;
  }
  const body = parseAdd(await readJson(req));
  if ('error' in body) return writeJson(res, 400, body);
  writeJson(res, 201, emails.addEmail(body));
}
