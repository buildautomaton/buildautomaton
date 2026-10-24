import { coerceRecord } from './coerce.js';
import { defineCollection, insertRecords, patchRecords, removeRecords, upsertRecord } from './rows.js';
import { matching, scoreCollection } from './query.js';
import type { ActionInput, ActionResult, Collection, StoreData } from './types.js';

export function applyAction(store: StoreData, input: ActionInput): ActionResult {
  if (input.action === 'collections') {
    return {
      ok: true,
      collections: Object.values(store.collections).map((item) => ({
        name: item.name,
        typeName: item.typeName,
        count: item.records.length,
      })),
    };
  }
  const name = input.collection?.trim() ?? '';
  if (!name) return { ok: false, error: 'collection is required' };
  if (input.action === 'define') {
    const error = defineCollection(store, input);
    if (error) return { ok: false, error };
    return summary(store.collections[name]);
  }
  const collection = store.collections[name];
  if (!collection) return { ok: false, error: `Unknown collection: ${name}` };
  return runOnCollection(collection, input);
}

function runOnCollection(collection: Collection, input: ActionInput): ActionResult {
  if (input.action === 'insert') return summary(collection, insertRecords(collection, input.records ?? []));
  if (input.action === 'upsert') return summary(collection, [upsertRecord(collection, input.record ?? {})]);
  if (input.action === 'replace') {
    collection.records = (input.records ?? []).map((record) => coerceRecord(collection, record));
    return summary(collection, collection.records);
  }
  if (input.action === 'update') return changed(collection, patchRecords(collection, input));
  if (input.action === 'remove') return changed(collection, removeRecords(collection, input));
  if (input.action === 'get') {
    const record = collection.records.find((item) => item.id === input.id) ?? null;
    if (!record) return { ok: false, error: 'Record not found' };
    return { ok: true, collection: collection.name, typeName: collection.typeName, record };
  }
  if (input.action === 'list') return { ...summary(collection), records: collection.records.slice(0, 200) };
  if (input.action === 'query') return { ...summary(collection), records: matching(collection, input.where) };
  if (input.action === 'count') return summary(collection);
  if (input.action === 'clear') {
    collection.records = [];
    return summary(collection);
  }
  if (input.action === 'score') {
    const records = scoreCollection(collection, input.scoreFields ?? [], input.high ?? 75, input.mid ?? 55);
    return { ...summary(collection), records };
  }
  return { ok: false, error: `Unknown action: ${input.action ?? ''}` };
}

type Stored = Extract<ActionResult, { ok: true }>;

function changed(collection: Collection, count: number): Stored {
  return { ...summary(collection), changed: count, records: collection.records.slice(0, 200) };
}

function summary(collection: Collection, records?: Collection['records']): Stored {
  return {
    ok: true,
    collection: collection.name,
    typeName: collection.typeName,
    count: collection.records.length,
    fields: collection.fields,
    ...(records ? { records } : {}),
  };
}
