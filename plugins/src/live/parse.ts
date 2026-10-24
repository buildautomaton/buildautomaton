import type { LiveMessage } from './types.js';

export function parseLiveMessage(raw: unknown): LiveMessage | null {
  const value = typeof raw === 'string' ? json(raw) : raw;
  if (!value || typeof value !== 'object') return null;
  const type = (value as LiveMessage).type;
  if (typeof type !== 'string' || !type) return null;
  return value as LiveMessage;
}

function json(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}
