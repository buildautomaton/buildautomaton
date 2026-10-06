import type { ApplierRegistry, ServiceApplier, ServiceId } from './registry-types.js';

export function createApplierRegistry(): ApplierRegistry {
  const appliers = new Map<ServiceId, { order: number; apply: ServiceApplier }>();
  return {
    register(id, apply, order = 100) {
      appliers.set(id, { order, apply });
    },
    get: (id) => appliers.get(id),
  };
}
