import type { PluginFactory, PluginInit, PluginRuntimeContext, ServiceContribution } from '@buildautomaton/runtime';
import type { ToolsHooks } from './hooks.js';
import type { ToolsImplementation } from './implementation.js';
import type { ToolsOptions } from './options.js';

/** A registerable tool set. Minion tools are one implementation of this contract. */
export type ToolsPlugin = {
  name: string;
  description?: string;
  services: ServiceContribution[];
  options?: ToolsOptions;
  hooks?: ToolsHooks;
  implementation: ToolsImplementation;
  runtime?: PluginRuntimeContext;
};

export type ToolsPluginFactory = PluginFactory<
  ToolsOptions,
  ToolsHooks,
  Partial<ToolsImplementation>,
  ToolsPlugin
>;

export type ToolsPluginInit = PluginInit<ToolsOptions, ToolsHooks, Partial<ToolsImplementation>>;
