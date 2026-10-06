import type { SqlMigration } from '@buildautomaton/plugins';

export const EMAIL_SCHEMA = `
CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  from_addr TEXT NOT NULL,
  to_addr TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  folder TEXT NOT NULL DEFAULT 'inbox',
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
)
`;

export const EMAIL_MIGRATIONS: SqlMigration[] = [
  {
    name: '001_emails',
    migrate: (sql) => {
      sql.exec(EMAIL_SCHEMA);
    },
  },
];
