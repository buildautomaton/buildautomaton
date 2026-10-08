import type { PluginSlots } from '@buildautomaton/runtime';
import type { HttpPlugin } from './types/plugin.js';
import { addHooksOnce, mergeOptional } from '../../apply/merge-hooks.js';
import { asHost } from '../../host-slots.js';

const seenHttp = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenHttp.get(slots);
  if (!set) {
    set = new WeakSet();
    seenHttp.set(slots, set);
  }
  return set;
}

export function applyHttpPlugin(slots: PluginSlots, plugin: HttpPlugin): void {
  const host = asHost(slots);
  host.http = plugin.registry;
  host.httpEndpoints = plugin.options.endpoints ?? [];
  if (plugin.attachFetch) host.attachFetch = plugin.attachFetch as typeof host.attachFetch;
  host.transport = {
    id: plugin.options.id ?? 'http',
    start: plugin.implementation.start,
    stop: plugin.implementation.stop,
  };
  if (plugin.hooks) {
    host.transportHooks = addHooksOnce(seenFor(slots), host.transportHooks, plugin.hooks, (a, b) =>
      mergeOptional(a, b)!,
    );
  }
}
