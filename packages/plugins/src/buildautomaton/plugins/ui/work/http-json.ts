export async function readJsonResponse<T>(res: Promise<Response>): Promise<T> {
  const resolved = await res;
  if (!resolved.ok) throw new Error(`${resolved.status} ${resolved.statusText}`);
  if (resolved.status === 204) return undefined as T;
  const text = await resolved.text();
  if (!text.trim()) return undefined as T;
  return JSON.parse(text) as T;
}
