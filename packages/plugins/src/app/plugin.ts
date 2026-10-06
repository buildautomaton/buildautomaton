import type { HttpRegistry } from '@plugins/transport/http/types/registry.js';
import type { HttpContributeContext } from '@plugins/transport/http/types/contribution.js';
import type { PluginInit, RuntimePlugin } from '@buildautomaton/runtime';
import { contributeAppRoutes } from './routes.js';

export type { AppPhase, AppState } from './state.js';

export type AppPluginOptions = {
  staticRoot?: string;
};

export type AppPlugin = RuntimePlugin & {
  contributeHttp: (http: HttpRegistry, ctx?: HttpContributeContext) => void;
};

/** Generic app runtime: a prompt until the first one transforms the running app. */
export function appPlugin(init: PluginInit<AppPluginOptions> = {}): AppPlugin {
  const cwd = init.runtime?.cwd ?? process.cwd();
  return {
    name: 'app',
    kind: 'app',
    runtime: init.runtime,
    contributeHttp(http: HttpRegistry) {
      contributeAppRoutes(http, cwd, init.options?.staticRoot);
    },
  };
}
