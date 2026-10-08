import { isoNow } from '@plugins/harnesses/acp/compose/iso-now.js';
import type { SessionImplementation } from '@plugins/work/host.js';
import type { SessionEvent } from '@plugins/session/session/records.js';

export function appendTurnEvent(
  backend: SessionImplementation,
  sessionId: string,
  kind: SessionEvent['kind'],
  payload: unknown,
): void {
  void backend.append(sessionId, { ts: isoNow(), kind, payload });
}

export function userMessagePayload(text: string): Record<string, unknown> {
  return { sessionUpdate: 'user_message', content: { type: 'text', text } };
}
