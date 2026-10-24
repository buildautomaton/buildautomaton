import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from '@plugins/stores/sqlite/plugin.js';
import { SECURITY_MIGRATIONS } from '@plugins/security/migrations.js';
import { createSecurity } from '@plugins/security/open.js';
import { DATA_STORE_MIGRATIONS } from './migrations.js';
import { createDataStore } from './open.js';

const CONFIRM = `function mutate(store, action) {
  if (action.name !== "confirm") return;
  const rows = Array.isArray(store.prospects) ? store.prospects : [];
  store.prospects = rows.filter((row) => row.partner !== action.args.partner).concat([
    { id: action.args.partner, partner: action.args.partner, status: "confirmed" }
  ]);
}`;

describe('data store', () => {
  it('defines a collection and lists the inserted record', async () => {
    const { store } = memoryStore();
    const defined = await store.apply({
      action: 'define',
      collection: 'prospects',
      typeName: 'Prospect',
      fields: [{ name: 'partner', type: 'string' }],
    });
    expect(defined.ok).toBe(true);
    await store.apply({ action: 'insert', collection: 'prospects', records: [{ partner: 'Ada' }] });
    const listed = await store.apply({ action: 'list', collection: 'prospects' });
    expect(listed.ok && listed.records?.[0]?.partner).toBe('Ada');
  });

  it('rolls back a mutation when the grant is denied or the function throws', async () => {
    const { store, security } = memoryStore([
      { action: 'confirm', source: CONFIRM },
      { action: 'boom', source: 'function mutate() { throw new Error("nope"); }' },
    ]);
    await store.apply({
      action: 'define',
      collection: 'prospects',
      typeName: 'Prospect',
      fields: [{ name: 'partner', type: 'string' }],
    });
    await security.addRole({
      id: 'reviewer',
      name: 'reviewer',
      grants: [{ collection: 'prospects', read: true, actions: ['list'], scope: { kind: 'all' } }],
    });
    await security.invite({ id: 'ada', name: 'Ada', roleId: 'reviewer' });
    await security.setActor('ada');
    const denied = await store.mutate('confirm', { partner: 'North' });
    expect(denied).toMatchObject({ ok: false });
    expect((await store.apply({ action: 'list', collection: 'prospects' })).ok && true).toBe(true);
    const listed = await store.apply({ action: 'list', collection: 'prospects' });
    expect(listed.ok && listed.count).toBe(0);
    await security.setActor('owner');
    const thrown = await store.mutate('boom', {});
    expect(thrown).toEqual({ ok: false, error: 'nope' });
    const after = await store.apply({ action: 'list', collection: 'prospects' });
    expect(after.ok && after.count).toBe(0);
    const saved = await store.mutate('confirm', { partner: 'North' });
    expect(saved.ok).toBe(true);
    const rows = await store.apply({ action: 'list', collection: 'prospects' });
    expect(rows.ok && rows.records?.[0]?.status).toBe('confirmed');
  });
});

function memoryStore(mutations: { action: string; source: string }[] = []) {
  const sql = sqlStorePlugin({ options: { file: ':memory:' } }).implementation!;
  sql.migrate('security', SECURITY_MIGRATIONS);
  sql.migrate('data-store', DATA_STORE_MIGRATIONS);
  const security = createSecurity(sql, 'ws');
  const store = createDataStore(sql, { workspaceId: 'ws', mutations }, security);
  return { store, security };
}
