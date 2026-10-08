import { EventEmitter } from 'node:events';
import type { IncomingMessage } from 'node:http';

export async function requestFromFetch(request: Request): Promise<IncomingMessage> {
  const url = new URL(request.url);
  const body = new Uint8Array(await request.arrayBuffer());
  const emitter = new EventEmitter();
  const req = emitter as IncomingMessage;
  req.method = request.method;
  req.url = `${url.pathname}${url.search}`;
  req.headers = Object.fromEntries(request.headers.entries());
  Object.assign(req, {
    async *[Symbol.asyncIterator]() {
      if (body.byteLength) yield Buffer.from(body);
    },
  });
  queueMicrotask(() => {
    if (body.byteLength) emitter.emit('data', Buffer.from(body));
    emitter.emit('end');
  });
  return req;
}
