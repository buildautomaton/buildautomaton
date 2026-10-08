import type { UiPlugin } from './plugin.js';
import { emptyUiSlots, type UiSlots } from './slots.js';

export function createUiSlots(plugins: readonly UiPlugin[] = []): UiSlots {
  const slots = emptyUiSlots();
  for (const plugin of plugins) wireOne(slots, plugin);
  slots.surfaces.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  slots.providers.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return slots;
}

function wireOne(slots: UiSlots, plugin: UiPlugin): void {
  if (plugin.hooks) slots.hooks.push(plugin.hooks);
  const impl = plugin.implementation;
  if (!impl) return;
  if (impl.surfaces) slots.surfaces.push(...impl.surfaces);
  if (impl.providers) slots.providers.push(...impl.providers);
  if (impl.layout) slots.layout = impl.layout;
}
