import type { RuntimePlugin } from '@buildautomaton/runtime';
import type { PluginInit, PluginRuntimeContext } from '@buildautomaton/runtime';
import type { LogFn } from '@buildautomaton/runtime';
import type { TransportKind } from '@plugins/transport/transport/options.js';
import type { SessionBackendKind } from '@plugins/session/session/options.js';
import type { TransportEndpoint } from '@plugins/transport/transport/endpoints.js';
import type { CoreSetHooks } from './core-set-hooks.js';
import type { CoreSetImplementation } from './core-set-implementation.js';
import { coreHarnessPlugins } from './harnesses/plugins.js';
import { diskSessionPlugin } from './session/disk/plugin.js';
import { streamSessionPlugin } from './session/stream/plugin.js';
import { defaultSessionsDir } from './session/session/create-backend.js';
import { minionToolsPlugin } from './tools/minion/plugin.js';
import { fileStorePlugin } from './stores/disk/plugin.js';
import { sqlStorePlugin } from './stores/sqlite/plugin.js';
import { coreSetTransport } from './core-set-transport.js';
import { acpPlugin } from './harnesses/acp/plugin.js';
import { buildautomatonSet } from './work/set.js';

export type CoreSetOptions = {
  cwd: string;
  log?: LogFn;
  sessionsDir?: string;
  backend?: SessionBackendKind;
  transport?: TransportKind;
  remoteUrl?: string;
  mcpHost?: string;
  mcpPort?: number;
  mcpPath?: string;
  minionTools?: boolean;
  /** SQLite file for the sql-store plugin. Default: `<cwd>/.harness/work.sqlite`. */
  sqlFile?: string;
  /** Extra HTTP mounts beside the buildautomaton work routes. */
  httpEndpoints?: TransportEndpoint[];
  /** Queue, artifact tools, and coordinator. Default on. */
  buildautomaton?: boolean;
};

function defaultLog(line: string): void {
  process.stderr.write(`${line}\n`);
}

/** Default plugin bundle: stores, harnesses, disk session, minion tools, HTTP. */
export function coreSet(
  init: PluginInit<CoreSetOptions, CoreSetHooks, CoreSetImplementation> & { options: CoreSetOptions },
): RuntimePlugin[] {
  const opts = init.options;
  const ctx: PluginRuntimeContext = init.runtime ?? { cwd: opts.cwd, log: opts.log ?? defaultLog };
  const dir = opts.sessionsDir ?? defaultSessionsDir(opts.cwd);
  const shared = { runtime: ctx };
  const plugins: RuntimePlugin[] = [
    fileStorePlugin({ options: { root: opts.cwd }, implementation: init.implementation?.fileStore, ...shared }),
    sqlStorePlugin({ options: { file: opts.sqlFile }, implementation: init.implementation?.sqlStore, ...shared }),
    ...coreHarnessPlugins({
      hooks: init.hooks?.harness,
      implementation: init.implementation?.harness,
      ...shared,
    }),
    diskSessionPlugin({
      options: { dir },
      hooks: init.hooks?.session,
      implementation: init.implementation?.session,
      ...shared,
    }),
  ];
  if (opts.minionTools !== false) {
    plugins.push(
      minionToolsPlugin({
        hooks: init.hooks?.tools,
        implementation: init.implementation?.tools,
        ...shared,
      }),
    );
  }
  if (opts.backend === 'stream') {
    plugins.push(
      streamSessionPlugin({
        hooks: init.hooks?.session,
        implementation: init.implementation?.session,
        ...shared,
      }),
    );
  }
  plugins.push(coreSetTransport(opts, init, shared), acpPlugin());
  if (opts.buildautomaton !== false) plugins.push(...buildautomatonSet({ runtime: ctx }));
  return plugins;
}
