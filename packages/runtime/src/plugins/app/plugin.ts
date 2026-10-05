import type { HttpRegistry } from '@/types/http/registry.js';
import type { PluginInit, RuntimePlugin } from '@/types/plugin.js';
import { contributeAppRoutes } from './routes.js';

export type { AppPhase, AppState } from './state.js';

/** Generic app runtime: a prompt until the first one transforms the running app. */
export function appPlugin(init: PluginInit = {}): RuntimePlugin {
  const cwd = init.runtime?.cwd ?? process.cwd();
  return {
    name: 'app',
    kind: 'app',
    runtime: init.runtime,
    contributeHttp(http: HttpRegistry) {
      contributeAppRoutes(http, cwd);
    },
  };
}
