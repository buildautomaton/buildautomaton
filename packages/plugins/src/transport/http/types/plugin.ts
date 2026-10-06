import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@buildautomaton/runtime';
import type { AttachFetch } from '../../../host-slots.js';
import type { TransportHooks } from '../../transport/hooks.js';
import type { TransportImplementation } from '../../transport/implementation.js';
import type { HttpTransportOptions } from '../../transport/options.js';
import type { HttpRegistry } from './registry.js';

export type HttpPlugin = {
  name: string;
  kind: 'http';
  options: HttpTransportOptions;
  hooks?: TransportHooks;
  implementation: TransportImplementation;
  registry: HttpRegistry;
  attachFetch?: AttachFetch;
  runtime?: PluginRuntimeContext;
};

export type HttpPluginFactory = PluginFactory<
  HttpTransportOptions,
  TransportHooks,
  Partial<TransportImplementation>,
  HttpPlugin
>;

export type HttpPluginInit = PluginInit<
  HttpTransportOptions,
  TransportHooks,
  Partial<TransportImplementation>
>;
