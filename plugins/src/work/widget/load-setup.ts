import type { BuildAutomatonSetup } from '../queue/http/setup-status.js';

export async function loadSetup(): Promise<BuildAutomatonSetup> {
  const res = await fetch('/api/buildautomaton');
  if (!res.ok) throw new Error('Could not read buildautomaton setup');
  return res.json() as Promise<BuildAutomatonSetup>;
}

export async function installAgent(type: string, token: string): Promise<void> {
  const res = await fetch('/api/buildautomaton/install', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type, token }),
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(body.error || 'Install failed');
}
