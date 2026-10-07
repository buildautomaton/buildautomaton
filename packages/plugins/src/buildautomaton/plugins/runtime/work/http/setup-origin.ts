const LOOPBACK = new Set(['localhost', '127.0.0.1', '::1']);

/** Allow the app UI, including Vite on another loopback port than the API. */
export function allowsBuildautomatonOrigin(origin: string | undefined, host: string | undefined): boolean {
  if (!origin) return true;
  if (!host) return false;
  try {
    const from = new URL(origin);
    if (from.host === host) return true;
    return loopback(from.hostname) && loopback(hostnameOf(host));
  } catch {
    return false;
  }
}

function hostnameOf(host: string): string {
  const bare = host.replace(/:\d+$/, '');
  return bare.replace(/^\[|\]$/g, '');
}

function loopback(hostname: string): boolean {
  return LOOPBACK.has(hostname.replace(/^\[|\]$/g, ''));
}
