import type { Collection, DataRecord, FieldDef, FieldType } from './types.js';

const TYPES = new Set<FieldType>(['string', 'number', 'boolean']);

export function parseFields(
  fields: { name?: string; type?: string; label?: string; help?: string }[] | undefined,
): FieldDef[] | string {
  const parsed: FieldDef[] = [];
  for (const field of fields ?? []) {
    const name = field.name?.trim() ?? '';
    const type = field.type?.trim() as FieldType;
    if (!name || !TYPES.has(type)) return 'Each field needs a name and type string, number, or boolean';
    parsed.push({
      name,
      type,
      ...(field.label?.trim() ? { label: field.label.trim() } : {}),
      ...(field.help?.trim() ? { help: field.help.trim() } : {}),
    });
  }
  return parsed;
}

export function coerceRecord(collection: Collection, record: Record<string, unknown>): DataRecord {
  const next: DataRecord = { id: String(record.id ?? crypto.randomUUID()) };
  const known = new Set(collection.fields.map((field) => field.name));
  for (const field of collection.fields) {
    if (record[field.name] === undefined) continue;
    next[field.name] = cast(field.type, record[field.name]);
  }
  for (const [key, value] of Object.entries(record)) {
    if (key !== 'id' && !known.has(key)) next[key] = value;
  }
  return next;
}

function cast(type: FieldType, value: unknown): unknown {
  if (type === 'number') {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }
  if (type === 'boolean') return value === true || value === 'true';
  return value == null ? '' : String(value);
}
