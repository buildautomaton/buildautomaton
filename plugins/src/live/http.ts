import { joinHttpPath, type HttpContributeContext, type HttpRegistry } from '@plugins/work/host.js';
import { asLiveHub } from './types.js';

export function contributeLiveHttp(http: HttpRegistry, ctx: HttpContributeContext): void {
  const live = asLiveHub(ctx.extras);
  if (!live) return;
  const path = joinHttpPath(ctx.mount ?? '/api', ctx.routes?.live ?? 'live');
  http.addWebSocket({
    path,
    subscribe: (broadcast) => live.attach(broadcast),
    onMessage: (payload) => live.receive(payload),
    onConnect: (send) => live.greet(send),
  });
}
