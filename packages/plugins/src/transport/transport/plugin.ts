import type { PluginFactory, PluginInit, PluginRuntimeContext } from '@buildautomaton/runtime';
import type { TransportHooks } from './hooks.js';
import type { TransportImplementation } from './implementation.js';
import type {
  HttpTransportOptions,
  RemoteTransportImplementation,
  StdioTransportOptions,
} from './options.js';

export type TransportPlugin = {
  name: string;
  kind: 'transport';
  options: HttpTransportOptions | StdioTransportOptions;
  hooks?: TransportHooks;
  implementation: TransportImplementation;
  runtime?: PluginRuntimeContext;
};

export type TransportPluginFactory = PluginFactory<
  HttpTransportOptions,
  TransportHooks,
  Partial<TransportImplementation> | RemoteTransportImplementation,
  TransportPlugin
>;

export type TransportPluginInit = PluginInit<
  HttpTransportOptions,
  TransportHooks,
  Partial<TransportImplementation>
>;
