import type { AnyFileStore } from './any-store.js';
import type { StoreContext } from '../../transport/http/types/contribution.js';

export function requireFileStore(stores: StoreContext, label: string): AnyFileStore {
  if (!stores.fileStore) throw new Error(`${label} requires a file-store`);
  return stores.fileStore;
}
