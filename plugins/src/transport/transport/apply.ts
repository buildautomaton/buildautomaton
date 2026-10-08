import type { PluginSlots } from '@buildautomaton/runtime';
import type { TransportPlugin } from './plugin.js';
import { addHooksOnce, mergeOptional } from '../../apply/merge-hooks.js';
import { asHost } from '../../host-slots.js';

const seenTransport = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenTransport.get(slots);
  if (!set) {
    set = new WeakSet();
    seenTransport.set(slots, set);
  }
  return set;
}

export function applyTransportPlugin(slots: PluginSlots, plugin: TransportPlugin): void {
  const host = asHost(slots);
  host.transport = {
    id: plugin.options.id ?? 'http',
    start: plugin.implementation.start,
    stop: plugin.implementation.stop,
  };
  if (plugin.hooks) {
    host.transportHooks = addHooksOnce(
      seenFor(slots),
      host.transportHooks,
      plugin.hooks,
      (a, b) => mergeOptional(a, b)!,
    );
  }
}
