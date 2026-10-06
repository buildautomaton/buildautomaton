import type { RuntimePlugin, ServiceContribution, ServiceId } from './registry-types.js';
import type { PluginSlots } from './plugin-slots.js';

export type SlotServiceApplier = (
  slots: PluginSlots,
  plugin: RuntimePlugin,
  contrib: ServiceContribution,
) => void;

const appliers = new Map<ServiceId, { order: number; apply: SlotServiceApplier }>();

/** Register how one service id is applied onto slots. */
export function registerService(id: ServiceId, apply: SlotServiceApplier, order = 100): void {
  appliers.set(id, { order, apply });
}

export function serviceApplier(id: ServiceId): { order: number; apply: SlotServiceApplier } | undefined {
  return appliers.get(id);
}
