import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@buildautomaton/runtime';
import type { AnyFileStore } from './any-store.js';
import type { FileStore } from './interface.js';
import type { FileStoreOptions } from './options.js';

export type FileStorePlugin = {
  name: string;
  kind: 'file-store';
  options?: FileStoreOptions;
  implementation: AnyFileStore;
  runtime?: PluginRuntimeContext;
};

export type FileStorePluginFactory = PluginFactory<
  FileStoreOptions,
  object,
  Partial<FileStore>,
  FileStorePlugin
>;

export type FileStorePluginInit = PluginInit<FileStoreOptions, object, Partial<AnyFileStore>>;
