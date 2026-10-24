const TTL_MS = 30_000;
const hits = new Map<string, { ok: boolean; at: number }>();

export function readPresence(command: string): boolean | undefined {
  const hit = hits.get(command);
  if (!hit || Date.now() - hit.at > TTL_MS) return undefined;
  return hit.ok;
}

export function writePresence(command: string, ok: boolean): void {
  hits.set(command, { ok, at: Date.now() });
}

export function forgetPresence(command: string): void {
  hits.delete(command);
}

export function clearCommandPresenceCache(): void {
  hits.clear();
}
