import { describe, expect, it } from 'vitest';
import { applyPlugins } from './plugin-apply.js';
import { sqlStorePlugin } from '@plugins/stores/sql/plugin.js';

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
    const names = slots.sqlStores.email!.all('SELECT name FROM sqlite_master WHERE type = ?', ['table']).map(
      (row) => row.name,
    );
    expect(names).toContain('notes');
    expect(slots.sqlStore).toBeUndefined();
  });
});
