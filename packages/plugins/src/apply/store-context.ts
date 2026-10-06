import type { PluginSlots } from '@buildautomaton/runtime';
import { asHost } from '../host-slots.js';
import type { StoreContext } from '../transport/http/types/contribution.js';

export function storeContext(slots: PluginSlots): StoreContext {
  const host = asHost(slots);
  return {
    fileStore: host.fileStore,
    sqlStore: host.sqlStore,
    sqlStores: host.sqlStores,
    sqlOpeners: host.sqlOpeners,
    extras: slots.extras,
    byKind: slots.byKind,
  };
}
