export type AppPhase = 'prompt' | 'transformed';

export type AppState = {
  phase: AppPhase;
  prompt: string | null;
};

export async function loadApp(): Promise<AppState> {
  const res = await fetch('/api/app', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not read the app');
  return res.json() as Promise<AppState>;
}

export async function transformApp(prompt: string): Promise<AppState> {
  const res = await fetch('/api/app', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const body = (await res.json().catch(() => ({}))) as AppState & { error?: string };
  if (!res.ok) throw new Error(body.error || 'Could not start the app');
  return body;
}
