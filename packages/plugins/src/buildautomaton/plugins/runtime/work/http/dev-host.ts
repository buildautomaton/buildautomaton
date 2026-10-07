export function localDevAllowed(hostname: string, mode: string | null): boolean {
  if (mode === 'off') return false;
  if (mode === 'always') return true;
  const host = hostname.replace(/^\[|\]$/g, '');
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.local');
}
