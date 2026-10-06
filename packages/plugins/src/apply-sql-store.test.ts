import { describe, expect, it } from 'vitest';
import { applyPlugins } from '@buildautomaton/runtime';
import { asHost } from '@plugins/host-slots.js';
import { sqlStorePlugin } from '@plugins/stores/sqlite/plugin.js';
import '@plugins/register-services.js';

describe('applySqlStorePlugin', () => {
  it('runs the schema store migrations on that Durable Object / file', () => {
    const slots = applyPlugins(
      [
        sqlStorePlugin({
          options: { schema: 'email', file: ':memory:' },
          sqlMigrations: [
            {
              name: '001_notes',
              migrate: (sql) => sql.exec('CREATE TABLE notes (id TEXT PRIMARY KEY)'),
            },
          ],
        }),
      ],
      { cwd: '/', log: () => {} },
    );
    const email = asHost(slots).sqlStores.email as import('@plugins/stores/sql-store/interface.js').SqlStore;
    const names = email.all('SELECT name FROM sqlite_master WHERE type = ?', ['table']).map((row) => row.name);
    expect(names).toContain('notes');
    expect(asHost(slots).sqlStore).toBeUndefined();
  });
});
