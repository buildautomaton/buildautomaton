import type { RuntimeContext, RuntimePlugin, ServiceContribution, ServiceId } from './registry-types.js';

export type ServiceApplier = (
  ctx: RuntimeContext,
  plugin: RuntimePlugin,
  contrib: ServiceContribution,
) => void;

export type ApplierRegistry = {
  register(id: ServiceId, apply: ServiceApplier, order?: number): void;
  get(id: ServiceId): { order: number; apply: ServiceApplier } | undefined;
};

export function createApplierRegistry(): ApplierRegistry {
  const appliers = new Map<ServiceId, { order: number; apply: ServiceApplier }>();
  return {
    register(id, apply, order = 100) {
      appliers.set(id, { order, apply });
    },
    get: (id) => appliers.get(id),
  };
}
