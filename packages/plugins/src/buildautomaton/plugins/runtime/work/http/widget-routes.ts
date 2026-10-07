import type { HttpRegistry } from '@plugins/buildautomaton/host.js';
import { sendBuildautomatonScript, sendWidgetAsset } from './serve-widget.js';

export function contributeWidgetRoutes(http: HttpRegistry): void {
  http.addRoute({ path: '/buildautomaton.js', handler: (req, res) => sendBuildautomatonScript(req, res) });
  http.addRoute({
    path: '/buildautomaton',
    handler: (req, res, hit) => sendWidgetAsset(req, res, hit.pathname),
  });
}
