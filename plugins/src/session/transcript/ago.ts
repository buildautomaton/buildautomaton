/** Short age for prompt rows, matching the dashboard (`12m ago`, `3h ago`). */
export function formatRelativeShort(iso: string, now = Date.now()): string {
  const start = Date.parse(iso);
  if (Number.isNaN(start)) return '';
  const sec = Math.max(0, Math.floor((now - start) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const minutes = Math.floor(sec / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 8) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.max(1, Math.floor(days / 365))}y ago`;
}
