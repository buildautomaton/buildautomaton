import type { HttpRegistry } from '@plugins/work/host.js';
import { sendBuildAutomatonScript, sendWidgetAsset } from './serve-widget.js';

export function contributeWidgetRoutes(http: HttpRegistry): void {
  http.addRoute({ path: '/buildautomaton.js', handler: (req, res) => sendBuildAutomatonScript(req, res) });
  http.addRoute({
    path: '/buildautomaton',
    handler: (req, res, hit) => sendWidgetAsset(req, res, hit.pathname),
  });
}
