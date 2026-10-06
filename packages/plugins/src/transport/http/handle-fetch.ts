import { handleHttpRequest, type HttpDispatchContext } from './http-handler.js';
import { requestFromFetch } from './fetch-request.js';
import { collectFetchResponse } from './fetch-response.js';
import { createMcpSseHub } from './sse-hub.js';

export async function handleFetchRequest(request: Request, ctx: HttpDispatchContext): Promise<Response> {
  const req = await requestFromFetch(request);
  const { res, done } = collectFetchResponse();
  await handleHttpRequest(req, res, { ...ctx, sse: ctx.sse ?? createMcpSseHub() });
  return done;
}
