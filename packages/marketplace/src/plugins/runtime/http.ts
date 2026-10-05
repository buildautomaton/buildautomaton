import type { IncomingMessage, ServerResponse } from 'node:http';
import type { MarketplaceImplementation } from '../../types/implementation.js';
import { asKind } from './rows.js';
import { writeJson, readJson } from './http-io.js';
import { parsePublish } from './http-parse.js';
import { handleMarketplaceItem } from './http-item.js';

export async function handleMarketplaceHttp(
  req: IncomingMessage,
  res: ServerResponse,
  market: MarketplaceImplementation,
  pathname: string,
): Promise<void> {
  const rest = pathname.replace(/^\/api\/marketplace\/?/, '');
  const method = req.method ?? 'GET';
  if (!rest) return handleCollection(req, res, market, method);
  const [id, extra] = rest.split('/');
  if (!id) return writeJson(res, 404, { error: 'Not found' });
  await handleMarketplaceItem(req, res, market, id, extra);
}

async function handleCollection(
  req: IncomingMessage,
  res: ServerResponse,
  market: MarketplaceImplementation,
  method: string,
): Promise<void> {
  if (method === 'GET') {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const kind = url.searchParams.get('kind');
    const query = url.searchParams.get('q') ?? '';
    const filter = kind === 'plugin' || kind === 'app' ? asKind(kind) : undefined;
    writeJson(res, 200, query ? market.search(query, filter) : market.list(filter));
    return;
  }
  if (method !== 'POST') return writeJson(res, 405, { error: 'Method not allowed' });
  const body = parsePublish(await readJson(req));
  if ('error' in body) return writeJson(res, 400, body);
  writeJson(res, 201, market.publish(body));
}
