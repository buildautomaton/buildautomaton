import type { Collection, DataRecord } from './types.js';

export function matching(collection: Collection, where: Record<string, unknown> | undefined): DataRecord[] {
  const entries = Object.entries(where ?? {});
  return collection.records.filter((record) => entries.every(([key, value]) => record[key] === value));
}

export function scoreCollection(collection: Collection, fields: string[], high: number, mid: number): DataRecord[] {
  for (const record of collection.records) {
    if (record.disqualified === true) {
      record.band = 'excluded';
      continue;
    }
    const score = fields.reduce((sum, key) => sum + Number(record[key] ?? 0), 0);
    record.score = score;
    record.band = score >= high ? 'high' : score >= mid ? 'worth-contact' : 'defer';
  }
  return collection.records;
}
