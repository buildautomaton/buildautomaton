import { describe, expect, it } from 'vitest';
import { sqlStorePlugin } from '@buildautomaton/runtime';
import { createEmailBackend } from './backend.js';
import { EMAIL_MIGRATIONS } from './migrations.js';

describe('email SQL backend', () => {
  it('stores and lists emails', () => {
    const sql = sqlStorePlugin({ options: { file: ':memory:' } }).implementation;
    sql.migrate('email-sql', EMAIL_MIGRATIONS);
    const mail = createEmailBackend(sql);
    const saved = mail.addEmail({
      fromAddr: 'ada@example.com',
      toAddr: 'al@example.com',
      subject: 'Hello',
      body: 'Hi there',
    });
    expect(mail.getEmail(saved.id)?.subject).toBe('Hello');
    expect(mail.listEmails('inbox')).toHaveLength(1);
    expect(mail.updateEmail(saved.id, { read: true, folder: 'archive' })?.read).toBe(true);
    expect(mail.listEmails('inbox')).toHaveLength(0);
    expect(mail.deleteEmail(saved.id)).toBe(true);
  });
});
