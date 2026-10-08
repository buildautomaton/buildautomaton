import type { PluginFactory, PluginInit, PluginRuntimeContext, ServiceContribution } from '@buildautomaton/runtime';
import type { SessionBackendWrap } from './backend.js';
import type { SessionHooks } from './hooks.js';
import type { SessionImplementation } from './implementation.js';
import type { DiskSessionOptions, SqlSessionOptions, StreamSessionOptions } from './options.js';
import type { PluginSupport } from './capability.js';
import type { StoreContext, HttpContributeContext } from '../../transport/http/types/contribution.js';
import type { HttpRegistry } from '../../transport/http/types/registry.js';
import type { SqlMigration } from '../../stores/sql-store/migration.js';

export type { SessionBackendWrap };

export type SessionPlugin = {
  name: string;
  description?: string;
  targetRuntime?: 'node' | 'react';
  services: ServiceContribution[];
  options: DiskSessionOptions | StreamSessionOptions | SqlSessionOptions;
  hooks?: SessionHooks;
  implementation?: SessionImplementation;
  wrapBackend?: SessionBackendWrap;
  supports?: PluginSupport;
  sqlMigrations?: readonly SqlMigration[];
  sqlSchema?: string;
  createFromStores?: (stores: StoreContext) => SessionImplementation;
  contributeHttp?: (http: HttpRegistry, ctx: HttpContributeContext) => void;
  runtime?: PluginRuntimeContext;
};

export type SessionPluginFactory = PluginFactory<
  DiskSessionOptions | StreamSessionOptions | SqlSessionOptions,
  SessionHooks,
  Partial<SessionImplementation>,
  SessionPlugin
>;

export type SessionPluginInit = PluginInit<
  DiskSessionOptions | StreamSessionOptions | SqlSessionOptions,
  SessionHooks,
  Partial<SessionImplementation>
>;
