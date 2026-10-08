export function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function contentText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(contentText).join('');
  const rec = asRecord(value);
  if (!rec) return '';
  if (typeof rec.text === 'string') return rec.text;
  return rec.content != null ? contentText(rec.content) : '';
}

export function textOf(rec: Record<string, unknown>): string {
  return contentText(rec.content) || (typeof rec.text === 'string' ? rec.text : '');
}

export function detailText(input: unknown, output: unknown): string {
  const parts = [preview(input), preview(output)].filter(Boolean);
  const text = parts.join('\n\n');
  return text.length > 4000 ? text.slice(0, 4000) : text;
}

function preview(value: unknown): string {
  if (value == null || value === '') return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '';
  }
}
