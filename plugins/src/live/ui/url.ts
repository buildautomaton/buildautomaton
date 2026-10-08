export function liveUrl(path = '/api/live'): string {
  const explicit = import.meta.env.VITE_LIVE_URL as string | undefined;
  if (explicit) return explicit;
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}${path}`;
}
