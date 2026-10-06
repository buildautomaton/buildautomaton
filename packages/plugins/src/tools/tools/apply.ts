import type { PluginSlots } from '@buildautomaton/runtime';
import type { ToolsPlugin } from './plugin.js';
import { addHooksOnce, mergeOptional } from '../../apply/merge-hooks.js';
import { asHost } from '../../host-slots.js';

const seenTools = new WeakMap<PluginSlots, WeakSet<object>>();

function seenFor(slots: PluginSlots): WeakSet<object> {
  let set = seenTools.get(slots);
  if (!set) {
    set = new WeakSet();
    seenTools.set(slots, set);
  }
  return set;
}

export function applyToolsPlugin(slots: PluginSlots, plugin: ToolsPlugin): void {
  const host = asHost(slots);
  host.tools.push(plugin.implementation);
  if (plugin.hooks) {
    host.toolsHooks = addHooksOnce(seenFor(slots), host.toolsHooks, plugin.hooks, (a, b) =>
      mergeOptional(a, b)!,
    );
  }
}
