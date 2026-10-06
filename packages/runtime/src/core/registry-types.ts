/** Log line sink (host-injected). */
export type LogFn = (message: string) => void;

/** Named service contract. */
export type ServiceId = string;

/** One service contribution: interface, implementation, or both. */
export type ServiceContribution<Options = object, Hooks = object, Implementation = unknown> = {
  id: ServiceId;
  interface?: object;
  options?: Options;
  hooks?: Hooks;
  implementation?: Implementation;
};

/** Stored record after a plugin provides a service. */
export type ServiceRecord<Options = object, Hooks = object, Implementation = unknown> = ServiceContribution<
  Options,
  Hooks,
  Implementation
> & {
  plugin: string;
};

export type PluginRuntimeContext = {
  cwd: string;
  log: LogFn;
};

export type PluginInit<Options = Record<string, never>, Hooks = object, Implementation = object> = {
  options?: Options;
  hooks?: Hooks;
  implementation?: Implementation;
  runtime?: PluginRuntimeContext;
};

/** A plugin is a named bundle of service contributions plus optional lifecycle. */
export type RuntimePlugin = {
  name: string;
  kind?: ServiceId;
  services?: ServiceContribution[];
  options?: object;
  hooks?: object;
  implementation?: unknown;
  runtime?: PluginRuntimeContext;
  start?: (ctx: RuntimeContext) => void | Promise<void>;
  stop?: (ctx: RuntimeContext) => void | Promise<void>;
};

export type PluginFactory<Options, Hooks, Implementation, Result extends RuntimePlugin = RuntimePlugin> = (
  init?: PluginInit<Options, Hooks, Implementation>,
) => Result;

export type RuntimeContext = {
  cwd: string;
  log: LogFn;
  plugins: PluginRegistry;
  services: ServiceRegistry;
};

export type ServiceApplier = (ctx: RuntimeContext, plugin: RuntimePlugin, contrib: ServiceContribution) => void;

export type PluginRegistry = {
  register(plugin: RuntimePlugin): void;
  all(): RuntimePlugin[];
  byName(name: string): RuntimePlugin | undefined;
  byService(id: ServiceId): RuntimePlugin[];
};

export type ServiceRegistry = {
  define(id: ServiceId, iface?: object): void;
  provide(record: ServiceRecord): void;
  interfaceOf(id: ServiceId): object | undefined;
  get<T>(id: ServiceId, match?: (record: ServiceRecord) => boolean): T | undefined;
  getAll(id: ServiceId): ServiceRecord[];
  implementations<T>(id: ServiceId): T[];
};

export type Runtime = RuntimeContext & {
  appliers: ApplierRegistry;
  apply(): void;
  start(): Promise<void>;
  stop(): Promise<void>;
};

export type ApplierRegistry = {
  register(id: ServiceId, apply: ServiceApplier, order?: number): void;
  get(id: ServiceId): { order: number; apply: ServiceApplier } | undefined;
};
