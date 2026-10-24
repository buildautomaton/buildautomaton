/** Clone a value for disk. Never throw back into an ACP JSON-RPC handler. */
export function jsonSafe(value: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(value)) as unknown;
  } catch {
    return { omitted: true };
  }
}
