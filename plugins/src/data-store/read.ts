import type { StoreGate } from './gate.js';
import { selected } from './rows.js';
import type { ActionInput, ActionResult, DataRecord, StoreData } from './types.js';

export async function filterCollections(store: StoreData, gate: StoreGate): Promise<ActionResult> {
  const collections = [];
  for (const item of Object.values(store.collections)) {
    if (!(await gate.can('list', item.name))) continue;
    collections.push({ name: item.name, typeName: item.typeName, count: item.records.length });
  }
  return { ok: true, collections };
}

export async function mask(result: ActionResult, gate: StoreGate): Promise<ActionResult> {
  if (!result.ok || !result.collection) return result;
  if (result.records) result.records = (await gate.filter(result.collection, result.records)) as DataRecord[];
  if (result.record && !(await gate.filter(result.collection, [result.record])).length) {
    return { ok: false, error: 'Record is outside the grant' };
  }
  return result;
}

export function previewRows(store: StoreData, input: ActionInput): Record<string, unknown>[] {
  if (input.action === 'insert' || input.action === 'replace') return input.records ?? [];
  if (input.action === 'upsert') return input.record ? [input.record] : [];
  const collection = store.collections[input.collection?.trim() ?? ''];
  if (!collection) return [];
  if (input.action === 'score' || input.action === 'clear') return collection.records;
  if (input.action === 'update' || input.action === 'remove') {
    return collection.records.filter((record) => selected(record, input));
  }
  return [];
}
