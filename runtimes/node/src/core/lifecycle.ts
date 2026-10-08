import type { Runtime } from './registry-types.js';

export async function startRuntime(runtime: Runtime): Promise<void> {
  for (const plugin of runtime.plugins.all()) {
    await plugin.start?.(runtime);
  }
}

export async function stopRuntime(runtime: Runtime): Promise<void> {
  for (const plugin of [...runtime.plugins.all()].reverse()) {
    await plugin.stop?.(runtime);
  }
}
