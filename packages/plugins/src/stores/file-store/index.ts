export type { FileStore } from './interface.js';
export type { FileStoreBackend } from './backend.js';
export type { AnyFileStore } from './any-store.js';
export { isFileStore } from './any-store.js';
export { fileExists, fileList, fileRead, fileRemove, fileWrite } from './await.js';
export type { FileStoreOptions } from './options.js';
export type { FileStorePlugin, FileStorePluginFactory, FileStorePluginInit } from './plugin.js';
