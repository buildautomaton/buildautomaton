import type { IncomingMessage, ServerResponse } from 'node:http';
import type { MarketplaceImplementation } from '../../types/implementation.js';
import { writeJson, readJson } from './http-io.js';
import { parsePatch } from './http-parse.js';

export async function handleMarketplaceItem(
  req: IncomingMessage,
  res: ServerResponse,
  market: MarketplaceImplementation,
  id: string,
  extra: string | undefined,
): Promise<void> {
  const method = req.method ?? 'GET';
  if (extra === 'source') {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const found = market.source(id, url.searchParams.get('path') ?? undefined);
    writeJson(res, found ? 200 : 404, found ?? { error: 'Not found' });
    return;
  }
  if (extra) return writeJson(res, 404, { error: 'Not found' });
  if (method === 'GET') {
    const found = market.get(id);
    writeJson(res, found ? 200 : 404, found ?? { error: 'Not found' });
    return;
  }
  if (method === 'PATCH') {
    const body = parsePatch(await readJson(req));
    if ('error' in body) return writeJson(res, 400, body);
    const next = market.update(id, body);
    writeJson(res, next ? 200 : 404, next ?? { error: 'Not found' });
    return;
  }
  if (method === 'DELETE') {
    const ok = market.remove(id);
    writeJson(res, ok ? 204 : 404, ok ? null : { error: 'Not found' });
    return;
  }
  writeJson(res, 405, { error: 'Method not allowed' });
}
