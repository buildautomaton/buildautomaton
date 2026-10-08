import { asLiveHub } from '@plugins/live/types.js';
import type { HttpContributeContext } from '@plugins/work/host.js';
import type { WorkImplementation } from '@plugins/work/types/work/implementation.js';

/** Board events ride the shared live socket as type `work`. */
export function attachWorkLive(ctx: HttpContributeContext): void {
  const live = asLiveHub(ctx.extras);
  const work = ctx.extras[ctx.pluginName] as WorkImplementation | undefined;
  if (!live || !work) return;
  work.subscribe((event) => live.publish('work', event));
}
