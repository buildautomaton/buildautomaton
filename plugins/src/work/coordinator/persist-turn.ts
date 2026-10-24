import { isoNow } from '@plugins/harnesses/acp/compose/iso-now.js';
import type { SessionImplementation } from '@plugins/work/host.js';
import type { SessionEvent } from '@plugins/session/session/records.js';
import { jsonSafe } from './json-safe.js';

/** Persist a turn. Errors stay here so ACP session/update cannot become [-32603]. */
export function appendTurnEvent(
  backend: SessionImplementation,
  sessionId: string,
  kind: SessionEvent['kind'],
  payload: unknown,
): void {
  try {
    const result = backend.append(sessionId, { ts: isoNow(), kind, payload: jsonSafe(payload) });
    if (result && typeof result.then === 'function') void result.catch(() => undefined);
  } catch {
    /* ignore */
  }
}

export function userMessagePayload(text: string): Record<string, unknown> {
  return { sessionUpdate: 'user_message', content: { type: 'text', text } };
}
