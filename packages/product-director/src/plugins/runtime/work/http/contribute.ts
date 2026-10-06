import {
  HTTP_DEFAULT_WORK_ROOT,
  joinHttpPath,
  type HttpRegistry,
  type HttpContributeContext,
} from '@buildautomaton/runtime';
import type { WorkImplementation } from '@/types/work/implementation.js';
import { dispatchWorkHttp } from './dispatch.js';
import { contributeSetupRoutes } from './setup-route.js';
import { contributeWidgetRoutes } from './widget-routes.js';

export function contributeWorkHttp(http: HttpRegistry, ctx: HttpContributeContext): void {
  const work = ctx.extras[ctx.pluginName] as WorkImplementation | undefined;
  if (!work) return;
  const root = ctx.mount ?? HTTP_DEFAULT_WORK_ROOT;
  const workPath = joinHttpPath(root, ctx.routes?.work ?? 'work');
  const artifactsPath = joinHttpPath(root, ctx.routes?.artifacts ?? 'artifacts');
  const assetsPath = joinHttpPath(root, ctx.routes?.assets ?? 'assets');
  addDispatch(http, workPath, work);
  addDispatch(http, artifactsPath, work, 'artifacts');
  addDispatch(http, assetsPath, work, 'assets');
  http.addWebSocket({
    path: joinHttpPath(workPath, 'events'),
    subscribe: (broadcast) => work.subscribe((event) => broadcast(event)),
  });
  contributeWidgetRoutes(http);
  contributeSetupRoutes(http, ctx.cwd, ctx.harnesses ?? [], ctx.extras);
}

function addDispatch(http: HttpRegistry, path: string, work: WorkImplementation, surface?: string): void {
  http.addRoute({
    path,
    handler: (req, res, hit) => dispatchWorkHttp(req, res, work, hit.pathname, path, surface),
  });
}
