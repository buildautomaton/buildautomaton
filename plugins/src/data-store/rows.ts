import { coerceRecord, parseFields } from './coerce.js';
import type { ActionInput, Collection, DataRecord, StoreData } from './types.js';

export function defineCollection(store: StoreData, input: ActionInput): string | null {
  const name = input.collection?.trim() ?? '';
  const typeName = input.typeName?.trim() ?? '';
  if (!name) return 'collection is required';
  if (!typeName) return 'typeName is required';
  const fields = parseFields(input.fields);
  if (typeof fields === 'string') return fields;
  const existing = store.collections[name];
  store.collections[name] = { name, typeName, fields, records: existing?.records ?? [] };
  return null;
}

export function insertRecords(collection: Collection, records: Record<string, unknown>[]): DataRecord[] {
  const inserted = records.map((record) => coerceRecord(collection, record));
  collection.records.push(...inserted);
  return inserted;
}

export function upsertRecord(collection: Collection, record: Record<string, unknown>): DataRecord {
  const next = coerceRecord(collection, record);
  const index = collection.records.findIndex((item) => item.id === next.id);
  if (index === -1) collection.records.push(next);
  else collection.records[index] = next;
  return next;
}

export function patchRecords(collection: Collection, input: ActionInput): number {
  const patch = input.patch ?? {};
  let count = 0;
  collection.records = collection.records.map((record) => {
    if (!selected(record, input)) return record;
    count += 1;
    return coerceRecord(collection, { ...record, ...patch, id: record.id });
  });
  return count;
}

export function removeRecords(collection: Collection, input: ActionInput): number {
  const before = collection.records.length;
  collection.records = collection.records.filter((record) => !selected(record, input));
  return before - collection.records.length;
}

export function selected(record: DataRecord, input: ActionInput): boolean {
  if (input.id) return record.id === input.id;
  const entries = Object.entries(input.where ?? {});
  if (!entries.length) return false;
  return entries.every(([key, value]) => record[key] === value);
}
