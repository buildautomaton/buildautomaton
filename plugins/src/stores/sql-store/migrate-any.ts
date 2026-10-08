import type { AnySqlStore } from './any-store.js';
import type { SqlMigration } from './migration.js';
import { sqlAll, sqlExec, sqlRun } from './await.js';
import { MIGRATIONS_BOOTSTRAP } from './migrate.js';

function checkpointSatisfied(applied: ReadonlySet<string>, replaces: readonly string[] | undefined): boolean {
  return Boolean(replaces?.length) && replaces!.every((name) => applied.has(name));
}

async function record(sql: AnySqlStore, scope: string, migration: SqlMigration, applied: Set<string>): Promise<void> {
  await sqlRun(sql, 'INSERT INTO __migrations (scope, name) VALUES (?, ?)', [scope, migration.name]);
  applied.add(migration.name);
  if (migration.checkpoint !== true || !migration.replacesLegacyMigrations?.length) return;
  for (const legacy of migration.replacesLegacyMigrations) {
    if (legacy === migration.name) continue;
    await sqlRun(sql, 'DELETE FROM __migrations WHERE scope = ? AND name = ?', [scope, legacy]);
    applied.delete(legacy);
  }
}

/** Async-safe migrations for D1 and Durable Object RPC stores. */
export async function runAnySqlMigrations(
  sql: AnySqlStore,
  scope: string,
  migrations: readonly SqlMigration[],
): Promise<void> {
  await sqlExec(sql, MIGRATIONS_BOOTSTRAP);
  const applied = new Set(
    (await sqlAll(sql, 'SELECT name FROM __migrations WHERE scope = ?', [scope])).map((row) => String(row.name)),
  );
  for (const migration of migrations) {
    if (applied.has(migration.name)) continue;
    if (migration.checkpoint === true && checkpointSatisfied(applied, migration.replacesLegacyMigrations)) {
      await record(sql, scope, migration, applied);
      continue;
    }
    if (await Promise.resolve(migration.alreadyApplied?.(sql))) {
      await record(sql, scope, migration, applied);
      continue;
    }
    await Promise.resolve(migration.migrate(sql));
    await record(sql, scope, migration, applied);
  }
}
