import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@buildautomaton/runtime';
import type { AnySqlStore } from './any-store.js';
import type { SqlStore } from './interface.js';
import type { SqlStoreOpener } from './opener.js';
import type { SqlStoreOptions } from './options.js';
import type { SqlMigration } from './migration.js';

export type SqlStorePlugin = {
  name: string;
  kind: 'sql-store';
  options?: SqlStoreOptions;
  implementation?: AnySqlStore;
  /** One store per key (per-plugin Durable Objects). */
  opener?: SqlStoreOpener;
  /** Migrations that belong to this schema (this Durable Object or D1 database). */
  sqlMigrations?: readonly SqlMigration[];
  runtime?: PluginRuntimeContext;
};

export type SqlStorePluginFactory = PluginFactory<
  SqlStoreOptions,
  object,
  Partial<SqlStore>,
  SqlStorePlugin
>;

export type SqlStorePluginInit = PluginInit<SqlStoreOptions, object, Partial<AnySqlStore>> & {
  sqlMigrations?: readonly SqlMigration[];
  opener?: SqlStoreOpener;
};
