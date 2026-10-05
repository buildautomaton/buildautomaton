import type { PluginSlots } from './plugin-slots.js';
import type { StoreContext } from '@/types/http/contribution.js';

export function storeContext(slots: PluginSlots): StoreContext {
  return {
    fileStore: slots.fileStore,
    sqlStore: slots.sqlStore,
    sqlStores: slots.sqlStores,
    extras: slots.extras,
    byKind: slots.byKind,
  };
}
