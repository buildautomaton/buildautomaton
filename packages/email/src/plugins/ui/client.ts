import type { AddEmailInput, Email, EmailFolder, EmailPatch } from '../../types/email.js';

async function json<T>(res: Promise<Response>): Promise<T> {
  const resolved = await res;
  if (resolved.status === 204) return undefined as T;
  const body = (await resolved.json().catch(() => ({}))) as T & { error?: string };
  if (!resolved.ok) throw new Error(body.error || resolved.statusText);
  return body;
}

export function createEmailClient(base = '') {
  const root = `${base}/api/emails`;
  return {
    list: (folder?: EmailFolder) =>
      json<Email[]>(fetch(folder ? `${root}?folder=${encodeURIComponent(folder)}` : root)),
    get: (id: string) => json<Email>(fetch(`${root}/${id}`)),
    add: (input: AddEmailInput) =>
      json<Email>(fetch(root, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) })),
    update: (id: string, patch: EmailPatch) =>
      json<Email>(
        fetch(`${root}/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(patch) }),
      ),
    remove: (id: string) => json<void>(fetch(`${root}/${id}`, { method: 'DELETE' })),
  };
}
