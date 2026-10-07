import type { PluginInit, PluginRuntimeContext, RuntimePlugin } from '@plugins/buildautomaton/host.js';
import { HTTP_DEFAULT_WORK_ROOT, type TransportEndpoint } from '@plugins/buildautomaton/host.js';
import { sqliteWorkPlugin } from './plugins/runtime/work/sqlite/plugin.js';
import { workToolsPlugin } from './plugins/runtime/work-tools/plugin.js';
import { artifactPlugins } from './plugins/runtime/artifacts/builtins.js';
import { coordinatorPlugin } from './plugins/runtime/coordinator/plugin.js';

export type BuildautomatonOptions = {
  work?: boolean;
  workRoot?: string;
};

export function buildautomatonHttpEndpoints(root = HTTP_DEFAULT_WORK_ROOT): TransportEndpoint[] {
  return [
    { plugin: 'work-sqlite', path: root },
    { plugin: 'session-disk', path: root },
  ];
}

export function buildautomatonSet(
  init: PluginInit<BuildautomatonOptions, object, object> = {},
): RuntimePlugin[] {
  if (init.options?.work === false) return [];
  const runtime: PluginRuntimeContext | undefined = init.runtime;
  return [
    ...artifactPlugins(),
    sqliteWorkPlugin({ runtime }),
    workToolsPlugin({ runtime }),
    coordinatorPlugin({ runtime }),
  ];
}
