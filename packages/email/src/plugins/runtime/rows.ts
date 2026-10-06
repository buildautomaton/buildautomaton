import type { Email, EmailFolder } from '../../types/email.js';

const FOLDERS = new Set<EmailFolder>(['inbox', 'sent', 'draft', 'archive']);

export function asFolder(value: unknown): EmailFolder {
  return FOLDERS.has(value as EmailFolder) ? (value as EmailFolder) : 'inbox';
}

export function rowToEmail(row: Record<string, unknown>): Email {
  return {
    id: String(row.id ?? ''),
    fromAddr: String(row.from_addr ?? ''),
    toAddr: String(row.to_addr ?? ''),
    subject: String(row.subject ?? ''),
    body: String(row.body ?? ''),
    folder: asFolder(row.folder),
    read: Number(row.read) === 1,
    createdAt: String(row.created_at ?? ''),
  };
}
