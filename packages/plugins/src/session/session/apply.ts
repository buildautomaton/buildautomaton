import type { PluginSlots } from '@buildautomaton/runtime';
import { asHost } from '../../host-slots.js';
import type { SessionPlugin } from './plugin.js';
import { addHooksOnce, mergeOptional } from '../../apply/merge-hooks.js';
import { storeContext } from '../../apply/store-context.js';
import { runPluginMigrations } from '../../apply/run-plugin-migrations.js';

const seenSession = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenSession.get(slots);
  if (!set) {
    set = new WeakSet();
    seenSession.set(slots, set);
  }
  return set;
}

export function applySessionPlugin(slots: PluginSlots, plugin: SessionPlugin): void {
  const host = asHost(slots);
  host.sessionPlugins.push(plugin);
  runPluginMigrations(slots, plugin);
  if (plugin.wrapBackend) host.backendWraps.push(plugin.wrapBackend);
  else if (plugin.implementation) setBackend(slots, plugin);
  else if (plugin.createFromStores) setBackend(slots, plugin, plugin.createFromStores(storeContext(slots)));
  if (plugin.hooks) {
    host.sessionHooks = addHooksOnce(seenFor(slots), host.sessionHooks, plugin.hooks, (a, b) =>
      mergeOptional(a, b)!,
    );
  }
}

function setBackend(slots: PluginSlots, plugin: SessionPlugin, impl = plugin.implementation): void {
  if (!impl) return;
  asHost(slots).backend = { id: plugin.options.id ?? 'disk', ...impl };
}
