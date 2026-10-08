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
  const options = { id: init.options?.id ?? 'file', root: prefix, backend: 'r2' as const };
  const implementation = (init.implementation ?? createR2FileStore(bucket!, prefix)) as FileStorePlugin['implementation'];
  return {
    name: 'store-file-r2',
    description: 'Cloudflare R2 file store. Use on Workers when files should live in an R2 bucket.',
    targetRuntime: 'node',
    services: [{ id: 'file-store', options, implementation }],
    options,
    implementation,
    runtime: init.runtime,
  };
}
