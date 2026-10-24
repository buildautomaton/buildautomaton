import type { AnySqlStore } from '@plugins/stores/sql-store/any-store.js';
import { applyAction } from './actions.js';
import type { StoreGate } from './gate.js';
import { applyPlain, changedNames, runMutate, toPlain, type MutationSource } from './mutate.js';
import { loadStore, saveCollection } from './persist.js';
import { filterCollections, mask, previewRows } from './read.js';
import type { ActionInput, ActionResult } from './types.js';

const WRITES = new Set(['define', 'insert', 'upsert', 'replace', 'update', 'remove', 'clear', 'score']);

export type DataStore = {
  apply(input: ActionInput): Promise<ActionResult>;
  mutate(action: string, args: Record<string, unknown>): Promise<ActionResult>;
};

export function createDataStore(
  sql: AnySqlStore,
  options: { workspaceId?: string; mutations?: MutationSource[] },
  gate: StoreGate | (() => StoreGate),
): DataStore {
  const workspaceId = options.workspaceId ?? 'local';
  const sources = new Map((options.mutations ?? []).map((item) => [item.action, item.source]));
  const readGate = () => (typeof gate === 'function' ? gate() : gate);
  return {
    apply: (input) => applyGuarded(sql, workspaceId, readGate(), input),
    mutate: (action, args) => mutateGuarded(sql, workspaceId, readGate(), sources, action, args),
  };
}

async function applyGuarded(
  sql: AnySqlStore,
  workspaceId: string,
  gate: StoreGate,
  input: ActionInput,
): Promise<ActionResult> {
  const loaded = await loadStore(sql, workspaceId);
  if (input.action === 'collections') return filterCollections(loaded, gate);
  const name = input.collection?.trim() ?? '';
  const decision = await gate.allow({
    action: input.action ?? '',
    collections: name ? [name] : [],
    rows: previewRows(loaded, input),
  });
  if (!decision.ok) return decision;
  const result = applyAction(loaded, input);
  if (!result.ok) return result;
  if (WRITES.has(input.action ?? '') && name) await saveCollection(sql, workspaceId, loaded.collections[name]);
  return mask(result, gate);
}

async function mutateGuarded(
  sql: AnySqlStore,
  workspaceId: string,
  gate: StoreGate,
  sources: Map<string, string>,
  action: string,
  args: Record<string, unknown>,
): Promise<ActionResult> {
  const source = sources.get(action);
  if (!source) return { ok: false, error: `Unknown mutation: ${action}` };
  const before = await loadStore(sql, workspaceId);
  const plain = toPlain(before);
  const decision = await gate.allow({ action, collections: Object.keys(plain), rows: [] });
  if (!decision.ok) return decision;
  try {
    runMutate(source, plain, { name: action, args });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
  const after = structuredClone(before);
  applyPlain(after, plain);
  const names = changedNames(before, after);
  for (const name of names) {
    const rows = after.collections[name]?.records ?? [];
    const written = await gate.allow({ action, collections: [name], rows });
    if (!written.ok) return written;
  }
  for (const name of names) {
    const collection = after.collections[name];
    if (collection) await saveCollection(sql, workspaceId, collection);
  }
  const first = names[0];
  return { ok: true, collection: first, count: first ? after.collections[first]?.records.length : 0 };
}
