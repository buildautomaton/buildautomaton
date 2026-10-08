export function pageHostWarning(page: string | null): string | null {
  if (!page) return 'Open this from the app dev server.';
  try {
    const host = new URL(page).hostname.replace(/^\[|\]$/g, '');
    const local = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.local');
    return local ? null : 'This page is not a local dev server.';
  } catch {
    return 'Open this from the app dev server.';
  }
}
