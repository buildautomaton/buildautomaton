import type { SqlMigration } from '@buildautomaton/plugins';

export const LISTING_SCHEMA = `
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
)
`;

export const LISTING_MIGRATIONS: SqlMigration[] = [
  {
    name: '001_marketplace_listings',
    migrate: (sql) => {
      sql.exec(LISTING_SCHEMA);
    },
  },
];
