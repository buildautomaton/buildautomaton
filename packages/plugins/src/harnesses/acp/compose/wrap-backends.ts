import type { SessionBackend, SessionBackendWrap } from '@plugins/session/session/backend.js';

export function wrapBackend(base: SessionBackend, wraps: SessionBackendWrap[]): SessionBackend {
  return wraps.reduce((current, wrap) => wrap(current), base);
}
