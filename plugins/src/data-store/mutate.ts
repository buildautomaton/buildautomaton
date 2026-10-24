import type { Collection, DataRecord, StoreData } from './types.js';

export type MutationSource = { action: string; source: string };

export function runMutate(
  source: string,
  store: Record<string, DataRecord[]>,
  action: { name: string; args: Record<string, unknown> },
): void {
  const fn = new Function(
    'store',
    'action',
    `${source}\n; if (typeof mutate === 'function') mutate(store, action);`,
  ) as (store: Record<string, DataRecord[]>, action: { name: string; args: Record<string, unknown> }) => void;
  fn(store, action);
}

export function toPlain(store: StoreData): Record<string, DataRecord[]> {
  const plain: Record<string, DataRecord[]> = {};
  for (const [name, collection] of Object.entries(store.collections)) {
    plain[name] = collection.records.map((record) => ({ ...record }));
  }
  return plain;
}

export function applyPlain(store: StoreData, plain: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(plain)) {
    if (!Array.isArray(value)) continue;
    const existing = store.collections[key];
    const records = value.map((row) => asRecord(row));
    store.collections[key] = existing
      ? { ...existing, records }
      : { name: key, typeName: 'Record', fields: [], records };
  }
}

function asRecord(row: unknown): DataRecord {
  const record = row && typeof row === 'object' ? (row as Record<string, unknown>) : {};
  return { ...record, id: String(record.id ?? crypto.randomUUID()) };
}

export function changedNames(before: StoreData, after: StoreData): string[] {
  const names = new Set([...Object.keys(before.collections), ...Object.keys(after.collections)]);
  return [...names].filter((name) => JSON.stringify(before.collections[name]) !== JSON.stringify(after.collections[name]));
}

export type { Collection };
