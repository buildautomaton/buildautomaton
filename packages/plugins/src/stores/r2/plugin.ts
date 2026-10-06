import type { FileStorePlugin, FileStorePluginInit } from '@plugins/stores/file-store/plugin.js';
import type { FileStoreOptions } from '@plugins/stores/file-store/options.js';
import type { R2BucketLike } from './types.js';
import { createR2FileStore } from './store.js';

export type R2FileStoreOptions = FileStoreOptions & {
  bucket?: R2BucketLike;
  prefix?: string;
};

export type R2FileStorePluginInit = Omit<FileStorePluginInit, 'options'> & {
  options?: R2FileStoreOptions;
};

/** File store backed by one R2 bucket. */
export function r2FileStorePlugin(init: R2FileStorePluginInit = {}): FileStorePlugin {
  const bucket = init.options?.bucket;
  if (!bucket && !init.implementation) {
    throw new Error('r2FileStorePlugin requires options.bucket or implementation');
  }
  const prefix = init.options?.prefix ?? init.options?.root ?? '';
  return {
    name: 'store-file-r2',
    kind: 'file-store',
    options: { id: init.options?.id ?? 'file', root: prefix, backend: 'r2' },
    implementation: (init.implementation ?? createR2FileStore(bucket!, prefix)) as FileStorePlugin['implementation'],
    runtime: init.runtime,
  };
}
