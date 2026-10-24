import type { LiveSession } from '@plugins/live/types.js';
import { readActiveChat } from './active-chat.js';

export function sessionIsRunning(id: string | null, sessions: LiveSession[]): boolean {
  if (!id) return false;
  return sessions.some((session) => session.id === id && session.status === 'running');
}

export function activeSessionRunning(sessions: LiveSession[]): boolean {
  const stored = readActiveChat();
  if (stored === '') return false;
  if (stored) return sessionIsRunning(stored, sessions);
  return sessions.some((session) => session.status === 'running');
}
