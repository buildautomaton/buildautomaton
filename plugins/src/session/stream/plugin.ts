import type { PluginInit } from '@buildautomaton/runtime';
import type { SessionHooks } from '@plugins/session/session/hooks.js';
import type { SessionImplementation } from '@plugins/session/session/implementation.js';
import type { SessionPlugin } from '@plugins/session/session/plugin.js';
import type { StreamSessionOptions } from '@plugins/session/session/options.js';
import type { SessionBackendWrap } from '@plugins/session/session/backend.js';
import { createStreamBackend } from './backend.js';

export function streamSessionPlugin(
  init: PluginInit<StreamSessionOptions, SessionHooks, Partial<SessionImplementation>> = {},
): SessionPlugin {
  const wrapBackend: SessionBackendWrap = (base) => ({
    ...createStreamBackend(base),
    ...init.implementation,
  });
  const options = { layer: true as const, id: init.options?.id };
  const plugin = {
    name: 'session-stream',
    description: 'In-memory stream wrap over another session backend. Use to keep a live tail while still persisting.',
    targetRuntime: 'node' as const,
    services: [{ id: 'session', options, hooks: init.hooks }],
    options,
    hooks: init.hooks,
    runtime: init.runtime,
    wrapBackend,
  };
  return plugin;
}
