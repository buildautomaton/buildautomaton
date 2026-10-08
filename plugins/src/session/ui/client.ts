export type DiskSession = {
  id: string;
  prompt: string;
  harness?: string;
  status: 'running' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  error?: string;
};

export type DiskSessionSnapshot = {
  session: DiskSession;
  events: { kind: string; payload: unknown }[];
};

export function listDiskSessions(base = ''): Promise<DiskSession[]> {
  return readJson<DiskSession[]>(fetch(`${base}/api/sessions`));
}

export function getDiskSession(id: string, base = ''): Promise<DiskSessionSnapshot> {
  return readJson<DiskSessionSnapshot>(fetch(`${base}/api/sessions/${encodeURIComponent(id)}`));
}

export function newestFirst(rows: DiskSession[]): DiskSession[] {
  return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function readJson<T>(pending: Promise<Response>): Promise<T> {
  const res = await pending;
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(body.error || `${res.status} ${res.statusText}`);
  return body as T;
}
