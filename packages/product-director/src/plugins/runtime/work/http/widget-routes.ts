import type { HttpRegistry } from '@buildautomaton/runtime';
import { sendDirectorScript, sendWidgetAsset } from './serve-widget.js';

export function contributeWidgetRoutes(http: HttpRegistry): void {
  http.addRoute({ path: '/director.js', handler: (req, res) => sendDirectorScript(req, res) });
  http.addRoute({
    path: '/director',
    handler: (req, res, hit) => sendWidgetAsset(req, res, hit.pathname),
  });
}
