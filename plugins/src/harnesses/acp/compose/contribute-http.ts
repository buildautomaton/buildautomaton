import type { PluginSlots } from '@buildautomaton/runtime';
import type { LogFn } from '@buildautomaton/runtime';
import { asHost } from '../../../host-slots.js';
import type { SessionImplementation } from '../../../session/session/implementation.js';
import type { ExtensionPlugin } from '../../../extension-plugin.js';

export function contributeHttp(
  slots: PluginSlots,
  ctx: { cwd: string; log: LogFn; backend?: SessionImplementation },
): void {
  const host = asHost(slots);
  if (!host.http) return;
  for (const plugin of slots.plugins as ExtensionPlugin[]) {
    if (!plugin.contributeHttp) continue;
    const mount = endpointFor(host.httpEndpoints, plugin.name);
    plugin.contributeHttp(host.http, {
      cwd: ctx.cwd,
      log: ctx.log,
      extras: slots.extras,
      pluginName: plugin.name,
      backend: ctx.backend,
      harnesses: host.harnesses,
      ...mount,
    });
  }
}

function endpointFor(endpoints: { plugin?: string; path?: string; routes?: Record<string, string> }[], name: string) {
  const hit = endpoints.find((e) => e.plugin === name);
  return {
    mount: hit?.path ? normalizeMount(hit.path) : undefined,
    routes: hit?.routes,
  };
}

function normalizeMount(path: string): string {
  const trimmed = path.trim();
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}
