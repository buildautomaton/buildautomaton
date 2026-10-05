import type { SqlMigration } from '@buildautomaton/runtime';

export const MARKETPLACE_SCHEMA = `
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  version TEXT NOT NULL DEFAULT '0.1.0',
  author TEXT NOT NULL DEFAULT '',
  plugins_json TEXT NOT NULL DEFAULT '[]',
  embedding_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS marketplace_artifacts (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  files_json TEXT NOT NULL DEFAULT '[]',
  payload_json TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS marketplace_files (
  listing_id TEXT NOT NULL,
  path TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (listing_id, path)
)
`;

export const MARKETPLACE_MIGRATIONS: SqlMigration[] = [
  {
    name: '001_marketplace',
    migrate: (sql) => {
      sql.exec(MARKETPLACE_SCHEMA);
    },
  },
];
