import type { FileStorePlugin, FileStorePluginInit } from '@plugins/stores/file-store/plugin.js';
import { createNodeFileStore } from './store.js';

export function fileStorePlugin(init: FileStorePluginInit = {}): FileStorePlugin {
  const root = init.options?.root ?? init.runtime?.cwd ?? process.cwd();
  const options = { root, id: init.options?.id ?? 'file', backend: init.options?.backend ?? 'disk' };
  const implementation = { ...createNodeFileStore(root), ...init.implementation };
  return {
    name: 'store-file',
    description: 'Local filesystem file store. Use when the host can read and write files on disk.',
    targetRuntime: 'node',
    services: [{ id: 'file-store', options, implementation }],
    options,
    implementation,
    runtime: init.runtime,
  };
}
