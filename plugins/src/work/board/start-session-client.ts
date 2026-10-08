import type { WorkItem } from './types.js';

export async function startBuildAutomatonSession(
  base: string,
  input: { prompt: string; project?: string; harness?: string; model?: string; sessionId?: string },
): Promise<WorkItem & { sessionId?: string }> {
  const res = await fetch(`${base}/api/buildautomaton/session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
  const body = (await res.json().catch(() => ({}))) as {
    work?: WorkItem;
    error?: string;
    status?: string;
    sessionId?: string;
  };
  if (!res.ok) throw new Error(body.error || `${res.status} ${res.statusText}`);
  if (body.status === 'waiting') throw new Error('Install an agent to start a session');
  const sessionId = body.sessionId ?? body.work?.sessionIds[0];
  if (body.work) return { ...body.work, sessionId };
  if (sessionId) return { id: sessionId, sessionIds: [sessionId], sessionId } as WorkItem & { sessionId: string };
  throw new Error(body.error || 'Could not start a session');
}
