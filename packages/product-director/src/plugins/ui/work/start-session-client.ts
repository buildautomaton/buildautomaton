import type { WorkItem } from './types.js';

export async function startDirectorSession(
  base: string,
  input: { prompt: string; project?: string },
): Promise<WorkItem> {
  const res = await fetch(`${base}/api/director/session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = (await res.json().catch(() => ({}))) as { work?: WorkItem; error?: string; status?: string };
  if (!res.ok) throw new Error(body.error || `${res.status} ${res.statusText}`);
  if (body.status === 'waiting') throw new Error('Install an agent to start a session');
  if (!body.work) throw new Error(body.error || 'Could not start a session');
  return body.work;
}
