import type { DirectorSetup } from '@plugins/runtime/work/http/setup-status.js';

export async function loadSetup(): Promise<DirectorSetup> {
  const res = await fetch('/api/director');
  if (!res.ok) throw new Error('Could not read director setup');
  return res.json() as Promise<DirectorSetup>;
}

export async function installAgent(type: string, token: string): Promise<void> {
  const res = await fetch('/api/director/install', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type, token }),
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(body.error || 'Install failed');
}
