import type { SqlMigration } from './migration.js';
import type { SqlStoreOpener } from './opener.js';

/** Run schema migrations the first time each opener key is used. */
export function withOpenerMigrations(
  opener: SqlStoreOpener,
  scope: string,
  migrations?: readonly SqlMigration[],
): SqlStoreOpener {
  if (!migrations?.length) return opener;
  const ready = new Set<string>();
  return {
    backend: opener.backend,
    async open(key) {
      const sql = await Promise.resolve(opener.open(key));
      if (!ready.has(key)) {
        await Promise.resolve(sql.migrate(scope, migrations));
        ready.add(key);
      }
      return sql;
    },
  };
}
