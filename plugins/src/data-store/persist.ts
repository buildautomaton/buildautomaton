import { sqlAll, sqlRun } from '@plugins/stores/sql-store/await.js';
import type { AnySqlStore } from '@plugins/stores/sql-store/any-store.js';
import type { Collection, DataRecord, FieldDef, StoreData } from './types.js';

export async function loadStore(sql: AnySqlStore, workspaceId: string): Promise<StoreData> {
  const collections: Record<string, Collection> = {};
  const defined = await sqlAll(
    sql,
    'SELECT name, type_name, fields FROM app_collection WHERE workspace_id = ?',
    [workspaceId],
  );
  for (const row of defined) {
    const name = String(row.name);
    collections[name] = {
      name,
      typeName: String(row.type_name),
      fields: parseFields(row.fields),
      records: [],
    };
  }
  const records = await sqlAll(
    sql,
    'SELECT collection, payload FROM app_record WHERE workspace_id = ?',
    [workspaceId],
  );
  for (const row of records) {
    const name = String(row.collection);
    const collection = collections[name];
    if (!collection) continue;
    collection.records.push(parseRecord(row.payload));
  }
  return { collections };
}

export async function saveCollection(sql: AnySqlStore, workspaceId: string, collection: Collection): Promise<void> {
  await sqlRun(
    sql,
    `INSERT INTO app_collection (workspace_id, name, type_name, fields) VALUES (?, ?, ?, ?)
     ON CONFLICT(workspace_id, name) DO UPDATE SET type_name = excluded.type_name, fields = excluded.fields`,
    [workspaceId, collection.name, collection.typeName, JSON.stringify(collection.fields)],
  );
  await sqlRun(sql, 'DELETE FROM app_record WHERE workspace_id = ? AND collection = ?', [
    workspaceId,
    collection.name,
  ]);
  for (const record of collection.records) {
    await sqlRun(sql, 'INSERT INTO app_record (workspace_id, collection, id, payload) VALUES (?, ?, ?, ?)', [
      workspaceId,
      collection.name,
      record.id,
      JSON.stringify(record),
    ]);
  }
}

function parseFields(value: unknown): FieldDef[] {
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value) as FieldDef[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseRecord(value: unknown): DataRecord {
  if (typeof value !== 'string') return { id: crypto.randomUUID() };
  try {
    const parsed = JSON.parse(value) as DataRecord;
    if (parsed?.id) return parsed;
    return { ...parsed, id: crypto.randomUUID() };
  } catch {
    return { id: crypto.randomUUID() };
  }
}
