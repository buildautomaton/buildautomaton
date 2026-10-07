import { applyPlugins } from './plugin-apply.js';
import type { PluginSlots } from './plugin-slots.js';
import type { RuntimeHandle, RuntimeOptions } from './runtime-types.js';

function defaultLog(line: string): void {
  process.stderr.write(`${line}\n`);
}

export type ComposeRuntime = (
  slots: PluginSlots,
  options: RuntimeOptions & { log: (line: string) => void },
) => Promise<RuntimeHandle>;

/**
 * Apply registered plugins, then let a plugin compose the handle.
 * The runtime does not know session, harness, store, or transport service ids.
 */
export async function createRuntime(options: RuntimeOptions): Promise<RuntimeHandle> {
  const log = options.log ?? defaultLog;
  const slots = applyPlugins(options.plugins ?? [], { log, cwd: options.cwd });
  await Promise.all(slots.ready);
  const compose = slots.extras.compose as ComposeRuntime | undefined;
  if (!compose) throw new Error('createRuntime requires a plugin that composes the handle');
  return compose(slots, { ...options, log });
}
