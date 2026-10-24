const KEY = 'ba-widget-session';

/** `null` if unset, `''` for a new chat, otherwise the session id. */
export function readActiveChat(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function writeActiveChat(id: string): void {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* ignore quota / private mode */
  }
}
