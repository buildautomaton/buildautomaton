import type { HttpRegistry } from '@plugins/transport/http/types/registry.js';
import type { HttpContributeContext } from '@plugins/transport/http/types/contribution.js';
import { joinHttpPath } from '@plugins/transport/http/http-path.js';
import { handleSessionHttp } from './handler.js';

export function contributeSessionHttp(http: HttpRegistry, ctx: HttpContributeContext): void {
  const backend = ctx.backend;
  if (!backend) return;
  const mount = joinHttpPath(ctx.mount ?? '/api', ctx.routes?.sessions ?? 'sessions');
  http.addRoute({
    path: mount,
    handler: (req, res, hit) => handleSessionHttp(req, res, backend, hit.pathname, mount),
  });
}
