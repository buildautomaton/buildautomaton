import path from 'node:path';

export function widgetFile(root: string, pathname: string): string | null {
  const base = path.resolve(root);
  if (pathname === '/director' || pathname === '/director/') return path.join(base, 'widget.html');
  if (!pathname.startsWith('/director/')) return null;
  const rel = decode(pathname.slice('/director/'.length));
  if (rel == null || rel === '' || rel.includes('\0')) return null;
  const full = path.resolve(base, rel);
  if (full !== base && !full.startsWith(`${base}${path.sep}`)) return null;
  return full;
}

function decode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
