import type { PluginInit } from '@buildautomaton/runtime';
import type { SessionHooks } from '@plugins/session/session/hooks.js';
import type { SessionImplementation } from '@plugins/session/session/implementation.js';
import type { SessionPlugin } from '@plugins/session/session/plugin.js';
import { createStreamBackend } from '../stream/backend.js';

/** In-memory sessions. Worker-safe; no SQL or filesystem. */
export function memorySessionPlugin(
  init: PluginInit<object, SessionHooks, Partial<SessionImplementation>> = {},
): SessionPlugin {
  return {
    name: 'session-memory',
    kind: 'session',
    options: { id: init.options && 'id' in init.options ? String(init.options.id) : 'memory' },
    hooks: init.hooks,
    implementation: { ...createStreamBackend(), ...init.implementation },
    runtime: init.runtime,
  };
}
