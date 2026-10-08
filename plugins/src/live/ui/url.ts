export function resolveWsUrl(
  path: string,
  env: { liveUrl?: string; apiOrigin?: string },
  location: { protocol: string; host: string },
): string {
  if (env.liveUrl) return env.liveUrl;
  if (env.apiOrigin) {
    const origin = env.apiOrigin.replace(/\/$/, '').replace(/^http/, 'ws');
    return `${origin}${path}`;
  }
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${location.host}${path}`;
}

/** Direct to the CLI in Vite dev. Same origin when the CLI serves the UI. */
export function liveUrl(path = '/api/live'): string {
  return resolveWsUrl(
    path,
    { liveUrl: import.meta.env.VITE_LIVE_URL, apiOrigin: import.meta.env.VITE_API_ORIGIN },
    window.location,
  );
}
