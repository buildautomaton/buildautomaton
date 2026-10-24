export const SECURITY_SCHEMA = `
CREATE TABLE IF NOT EXISTS sec_user (
  workspace_id TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (workspace_id, id)
);
CREATE TABLE IF NOT EXISTS sec_role (
  workspace_id TEXT NOT NULL,
  id TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (workspace_id, id)
);
CREATE TABLE IF NOT EXISTS sec_member (
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  PRIMARY KEY (workspace_id, user_id, role_id)
);
CREATE TABLE IF NOT EXISTS sec_grant (
  workspace_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  collection TEXT NOT NULL,
  can_read INTEGER NOT NULL,
  actions TEXT NOT NULL,
  scope TEXT NOT NULL,
  PRIMARY KEY (workspace_id, role_id, collection)
);
CREATE TABLE IF NOT EXISTS sec_actor (
  workspace_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL
);
`;
