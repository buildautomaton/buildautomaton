import type { SqlStore } from '@buildautomaton/plugins';
import type { AddEmailInput, EmailFolder, EmailPatch } from '../../types/email.js';
import type { EmailImplementation } from '../../types/implementation.js';
import { asFolder, rowToEmail } from './rows.js';

export function createEmailBackend(sql: SqlStore): EmailImplementation {
  return {
    listEmails(folder) {
      const rows = folder
        ? sql.all('SELECT * FROM emails WHERE folder = ? ORDER BY created_at DESC', [folder])
        : sql.all('SELECT * FROM emails ORDER BY created_at DESC');
      return rows.map(rowToEmail);
    },
    getEmail(id) {
      const row = sql.get('SELECT * FROM emails WHERE id = ?', [id]);
      return row ? rowToEmail(row) : null;
    },
    addEmail(input) {
      return addEmail(sql, input);
    },
    updateEmail(id, patch) {
      return updateEmail(sql, id, patch);
    },
    deleteEmail(id) {
      const found = sql.get('SELECT id FROM emails WHERE id = ?', [id]);
      if (!found) return false;
      sql.run('DELETE FROM emails WHERE id = ?', [id]);
      return true;
    },
  };
}

function addEmail(sql: SqlStore, input: AddEmailInput) {
  const email = {
    id: crypto.randomUUID(),
    fromAddr: input.fromAddr.trim(),
    toAddr: input.toAddr.trim(),
    subject: (input.subject ?? '').trim(),
    body: input.body ?? '',
    folder: asFolder(input.folder),
    read: false,
    createdAt: new Date().toISOString(),
  };
  sql.run(
    'INSERT INTO emails (id, from_addr, to_addr, subject, body, folder, read, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?)',
    [email.id, email.fromAddr, email.toAddr, email.subject, email.body, email.folder, email.createdAt],
  );
  return email;
}

function updateEmail(sql: SqlStore, id: string, patch: EmailPatch) {
  const current = sql.get('SELECT * FROM emails WHERE id = ?', [id]);
  if (!current) return null;
  const next = rowToEmail(current);
  const folder: EmailFolder = patch.folder ?? next.folder;
  const read = patch.read ?? next.read;
  const subject = patch.subject ?? next.subject;
  const body = patch.body ?? next.body;
  sql.run('UPDATE emails SET folder = ?, read = ?, subject = ?, body = ? WHERE id = ?', [
    folder,
    read ? 1 : 0,
    subject,
    body,
    id,
  ]);
  return { ...next, folder, read, subject, body };
}
