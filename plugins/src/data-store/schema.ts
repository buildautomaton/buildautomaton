export const DATA_STORE_SCHEMA = `
CREATE TABLE IF NOT EXISTS app_collection (
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type_name TEXT NOT NULL,
  fields TEXT NOT NULL,
  PRIMARY KEY (workspace_id, name)
);
CREATE TABLE IF NOT EXISTS app_record (
  workspace_id TEXT NOT NULL,
  collection TEXT NOT NULL,
  id TEXT NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (workspace_id, collection, id)
);
`;
