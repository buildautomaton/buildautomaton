import type { PluginFactory, PluginInit, PluginRuntimeContext, ServiceContribution } from '@buildautomaton/runtime';
import type { AnyFileStore } from './any-store.js';
import type { FileStore } from './interface.js';
import type { FileStoreOptions } from './options.js';

export type FileStorePlugin = {
  name: string;
  description?: string;
  targetRuntime?: 'node' | 'react';
  services: ServiceContribution[];
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
