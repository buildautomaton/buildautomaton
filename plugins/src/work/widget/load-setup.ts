import { HARNESS_KEY } from '../prompt/choice.js';
import type { BuildAutomatonSetup } from '../queue/http/setup-status.js';

let cached: BuildAutomatonSetup | null = null;
let pending: Promise<BuildAutomatonSetup> | null = null;

export function peekSetup(): BuildAutomatonSetup | null {
  return cached;
}

export async function loadSetup(force = false): Promise<BuildAutomatonSetup> {
  if (!force && cached) return cached;
  if (!force && pending) return pending;
  const run = fetchSetup();
  pending = run;
  try {
    cached = await run;
    return cached;
  } finally {
    if (pending === run) pending = null;
  }
}

async function fetchSetup(): Promise<BuildAutomatonSetup> {
  const prefer = typeof localStorage === 'undefined' ? '' : (localStorage.getItem(HARNESS_KEY) ?? '');
  const query = prefer ? `?prefer=${encodeURIComponent(prefer)}` : '';
  const res = await fetch(`/api/buildautomaton${query}`);
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
