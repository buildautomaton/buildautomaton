import type { RuntimePlugin } from '@buildautomaton/runtime';
import { sqlStoreInterface } from './contract.js';

/** Interface-only plugin: declares the sql-store service and its types. */
export function sqlStoreService(): RuntimePlugin {
  return {
    name: 'sql-store',
    services: [{ id: 'sql-store', interface: sqlStoreInterface }],
  };
}
