import type { HarnessHooks } from '@plugins/harnesses/harness/hooks.js';
import type { SessionHooks } from '@plugins/session/session/hooks.js';
import type { TransportHooks } from '@plugins/transport/transport/hooks.js';
import type { ToolsHooks } from '@plugins/tools/tools/hooks.js';
export type CoreSetHooks = {
  harness?: HarnessHooks;
  session?: SessionHooks;
  transport?: TransportHooks;
  tools?: ToolsHooks;
};
