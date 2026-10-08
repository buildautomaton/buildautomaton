import type { ClientHostHooks } from '@plugins/harnesses/acp/engine/types.js';
import type { HarnessHooks } from '@plugins/harnesses/harness/hooks.js';
import type { HarnessHostImplementation } from '@plugins/harnesses/harness/host.js';
import type { SessionBackend } from '@plugins/session/session/backend.js';
import { mergeHarnessHost, mergeHarnessHooks } from './merge-hooks.js';
import { persistHooksFromBackend } from '@plugins/session/session/persist-hooks.js';

/** Session persist plus harness hooks/host — the engine's client-side host. */
export async function buildClientHostHooks(options: {
  backend: SessionBackend;
  harnessHooks?: HarnessHooks;
  harnessHost?: HarnessHostImplementation;
}): Promise<ClientHostHooks> {
  const persist = await persistHooksFromBackend(options.backend);
  const host = mergeHarnessHost(persist, options.harnessHost);
  const hooks = mergeHarnessHooks({}, options.harnessHooks);
  return { ...host, ...hooks };
}
