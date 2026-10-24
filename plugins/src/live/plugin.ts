import type { PluginInit } from '@buildautomaton/runtime';
import type { ExtensionPlugin } from '@plugins/extension-plugin.js';
import { createLiveHub } from './hub.js';
import { contributeLiveHttp } from './http.js';

/** Typed websocket bus on the HTTP transport. Plugins register message types on extras.live. */
export function livePlugin(init: PluginInit = {}): ExtensionPlugin {
  return {
    name: 'live',
    description:
      'Generic websocket bus. Use to open one connection from the UI to the CLI and register message types on it.',
    targetRuntime: 'node',
    services: [{ id: 'live' }],
    createFromStores: () => createLiveHub(),
    contributeHttp: contributeLiveHttp,
    runtime: init.runtime,
  };
}
