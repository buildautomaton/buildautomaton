import type { PluginSlots } from '@buildautomaton/runtime';
import type { AgentHarness } from '../acp/host/types.js';
import type { HarnessPlugin } from './plugin.js';
import { addHooksOnce, mergeHarnessHooks, mergeHarnessHost } from '../../apply/merge-hooks.js';
import { hasHostMethods, hostSkipKey, pickHarnessHost } from './pick-host.js';
import { asHost } from '../../host-slots.js';

const seenHarness = new WeakMap<PluginSlots, WeakSet<object>>();
const seenHost = new WeakMap<PluginSlots, WeakSet<object>>();

function seen(map: WeakMap<PluginSlots, WeakSet<object>>, slots: PluginSlots): WeakSet<object> {
  let set = map.get(slots);
  if (!set) {
    set = new WeakSet();
    map.set(slots, set);
  }
  return set;
}

export function applyHarnessPlugin(slots: PluginSlots, plugin: HarnessPlugin): void {
  const hostSlots = asHost(slots);
  const harness: AgentHarness = { ...plugin.options, ...plugin.implementation };
  hostSlots.harnesses.push(harness);
  if (plugin.hooks) {
    hostSlots.harnessHooks = addHooksOnce(
      seen(seenHarness, slots),
      hostSlots.harnessHooks,
      plugin.hooks,
      mergeHarnessHooks,
    );
  }
  const impl = plugin.implementation;
  const key = hostSkipKey(impl);
  if (key && seen(seenHost, slots).has(key)) return;
  if (key) seen(seenHost, slots).add(key);
  const host = pickHarnessHost(impl);
  if (!hasHostMethods(host)) return;
  hostSlots.harnessHost = hostSlots.harnessHost ? mergeHarnessHost(hostSlots.harnessHost, host) : host;
}
