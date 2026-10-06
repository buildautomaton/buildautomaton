import type { ServiceId, ServiceRecord, ServiceRegistry } from './registry-types.js';

export type { ServiceRegistry };

export function createServiceRegistry(): ServiceRegistry {
  const interfaces = new Map<ServiceId, object>();
  const records: ServiceRecord[] = [];
  return {
    define(id, iface) {
      if (iface) interfaces.set(id, iface);
      else if (!interfaces.has(id)) interfaces.set(id, { id });
    },
    provide(record) {
      if (record.interface) interfaces.set(record.id, record.interface);
      else if (!interfaces.has(record.id)) interfaces.set(record.id, { id: record.id });
      records.push(record);
    },
    interfaceOf: (id) => interfaces.get(id),
    get(id, match) {
      const hit = records.find((record) => record.id === id && record.implementation && (!match || match(record)));
      return hit?.implementation as never;
    },
    getAll: (id) => records.filter((record) => record.id === id),
    implementations: (id) =>
      records
        .filter((record) => record.id === id && record.implementation)
        .map((record) => record.implementation as never),
  };
}
