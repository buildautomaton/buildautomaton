export function elapsedLabel(fromIso: string, toMs: number): string {
  const start = Date.parse(fromIso);
  if (Number.isNaN(start)) return '0s';
  const sec = Math.max(0, Math.floor((toMs - start) / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
  return `${s}s`;
}

export function sessionElapsed(
  session: { status: string; createdAt: string; updatedAt: string },
  now: number,
): string {
  const end = session.status === 'running' ? now : Date.parse(session.updatedAt);
  return elapsedLabel(session.createdAt, Number.isNaN(end) ? now : end);
}
