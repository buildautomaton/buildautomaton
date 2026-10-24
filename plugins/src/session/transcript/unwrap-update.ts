import { asRecord } from './text.js';

/** Flatten sendRequest wrappers so permission/plan fields sit at the top level. */
export function unwrapUpdate(payload: unknown): Record<string, unknown> | undefined {
  const rec = asRecord(payload);
  if (!rec) return;
  const inner = asRecord(rec.payload);
  if (!inner || rec.sessionUpdate != null || rec.session_update != null) return rec;
  if (rec.type === 'session_update' || rec.requestId != null) {
    return { ...inner, requestId: rec.requestId ?? inner.requestId, kind: rec.kind ?? inner.kind };
  }
  return rec;
}
