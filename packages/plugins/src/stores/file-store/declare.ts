import type { RuntimePlugin } from '@buildautomaton/runtime';
import { fileStoreInterface } from './contract.js';

export function fileStoreService(): RuntimePlugin {
  return {
    name: 'file-store',
    services: [{ id: 'file-store', interface: fileStoreInterface }],
  };
}
