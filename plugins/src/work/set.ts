import type { PluginInit, PluginRuntimeContext, RuntimePlugin } from '@plugins/work/host.js';
import { HTTP_DEFAULT_WORK_ROOT, type TransportEndpoint } from '@plugins/work/host.js';
import { sqliteWorkPlugin } from './queue/sqlite/plugin.js';
import { workToolsPlugin } from './work-tools/plugin.js';
import { artifactPlugins } from './artifacts/builtins.js';
import { coordinatorPlugin } from './coordinator/plugin.js';

export type BuildAutomatonOptions = {
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
  init: PluginInit<BuildAutomatonOptions, object, object> = {},
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
