import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from '@plugins/stores/sqlite/plugin.js';
import { judge } from './allow.js';
import { SECURITY_MIGRATIONS } from './migrations.js';
import { createSecurity } from './open.js';

describe('security grants', () => {
  it('lets the owner through and rejects a user outside the grant', () => {
    const grant = {
      collection: 'prospects',
      read: true,
      actions: ['confirm'],
      scope: { kind: 'user' as const, field: 'ownerId' },
    };
    expect(judge({ owner: true, grants: [], userId: 'owner', action: 'confirm', collections: ['prospects'], rows: [] }).ok).toBe(
      true,
    );
    expect(
      judge({
        owner: false,
        grants: [grant],
        userId: 'ada',
        action: 'confirm',
        collections: ['prospects'],
        rows: [{ ownerId: 'ada' }],
      }).ok,
    ).toBe(true);
    const denied = judge({
      owner: false,
      grants: [grant],
      userId: 'ada',
      action: 'confirm',
      collections: ['prospects'],
      rows: [{ ownerId: 'other' }],
    });
    expect(denied).toEqual({ ok: false, error: 'Rows are outside the grant for prospects' });
  });

  it('seeds an owner and keeps a rejected invite from widening access', async () => {
    const sql = sqlStorePlugin({ options: { file: ':memory:' } }).implementation!;
    sql.migrate('security', SECURITY_MIGRATIONS);
    const security = createSecurity(sql, 'ws');
    expect(await security.currentActor()).toBe('owner');
    expect((await security.allow({ action: 'confirm', collections: ['prospects'], rows: [{ ownerId: 'x' }] })).ok).toBe(true);
    await security.addRole({
      id: 'reviewer',
      name: 'reviewer',
      grants: [{ collection: 'prospects', read: true, actions: ['confirm'], scope: { kind: 'all' } }],
    });
    await security.invite({ id: 'ada', name: 'Ada', roleId: 'reviewer' });
    await security.setActor('ada');
    expect((await security.allow({ action: 'record-commission', collections: ['commissions'] })).ok).toBe(false);
    expect(await security.can('confirm', 'prospects')).toBe(true);
    expect(await security.filter('prospects', [{ id: '1' }, { id: '2' }])).toHaveLength(2);
  });
});
