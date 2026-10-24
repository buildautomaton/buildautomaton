import type { PluginSlots, ServiceContribution } from '@buildautomaton/runtime';
import type { ToolsPlugin } from './plugin.js';
import type { ToolsImplementation } from './implementation.js';
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

export function applyToolsPlugin(slots: PluginSlots, plugin: ToolsPlugin, contrib?: ServiceContribution): void {
  const host = asHost(slots);
  const impl = (contrib?.implementation as ToolsImplementation | undefined) ?? plugin.implementation;
  if (impl) host.tools.push(impl);
  if (plugin.hooks) {
    host.toolsHooks = addHooksOnce(seenFor(slots), host.toolsHooks, plugin.hooks, (a, b) =>
      mergeOptional(a, b)!,
    );
  }
}
