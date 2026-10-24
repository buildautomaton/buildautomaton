import type { PluginInit } from '@buildautomaton/runtime';
import type { ExtensionPlugin } from '@plugins/extension-plugin.js';
import { contributeGitRoutes } from './http.js';

/** Node plugin: cwd git repo and branch. Cached, one git process per lookup. */
export function gitPlugin(init: PluginInit = {}): ExtensionPlugin {
  const cwd = init.runtime?.cwd ?? process.cwd();
  return {
    name: 'git',
    description:
      'Git context for the working directory: repo root and current branch. Use when a host should show whether cwd is a repository.',
    targetRuntime: 'node',
    services: [{ id: 'git' }],
    runtime: init.runtime,
    contributeHttp(http, ctx) {
      contributeGitRoutes(http, ctx?.cwd ?? cwd);
    },
  };
}
