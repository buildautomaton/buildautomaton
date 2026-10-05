import { describe, expect, it } from 'vitest';
import { applyPlugins, sqlStorePlugin } from '@buildautomaton/runtime';
import type { EmailImplementation } from '../../types/implementation.js';
import { emailPlugin } from './plugin.js';

describe('emailPlugin', () => {
  it('requires a sql-store', () => {
    expect(() => emailPlugin().createFromStores?.({} as never)).toThrow(/sql-store/);
  });

  it('migrates and stores mail on the shared SQL store', () => {
    const slots = applyPlugins([sqlStorePlugin({ options: { file: ':memory:' } }), emailPlugin()], {
      cwd: '/',
      log: () => {},
    });
    const mail = slots.extras['email-sql'] as EmailImplementation;
    const saved = mail.addEmail({ fromAddr: 'ada@example.com', toAddr: 'al@example.com', subject: 'Hi' });
    expect(mail.getEmail(saved.id)?.subject).toBe('Hi');
    expect(mail.listEmails()).toHaveLength(1);
  });
});
