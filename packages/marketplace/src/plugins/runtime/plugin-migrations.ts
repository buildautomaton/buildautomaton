import type { SqlMigration } from '@buildautomaton/plugins';

export const PLUGIN_SCHEMA = `
CREATE TABLE IF NOT EXISTS plugin_versions (
  version TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS plugin_artifacts (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  files_json TEXT NOT NULL DEFAULT '[]',
  payload_json TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS plugin_files (
  version TEXT NOT NULL,
  path TEXT NOT NULL,
  PRIMARY KEY (version, path)
)
`;

export const PLUGIN_MIGRATIONS: SqlMigration[] = [
  {
    name: '001_marketplace_plugin',
    migrate: (sql) => {
      sql.exec(PLUGIN_SCHEMA);
    },
  },
];
