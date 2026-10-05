import { useCallback, useEffect, useState } from 'react';
import { Inbox as InboxIcon, Mail } from 'lucide-react';
import { Column, EmptyState } from '@buildautomaton/ui-runtime';
import type { AddEmailInput, Email } from '../../types/email.js';
import { createEmailClient } from './client.js';
import { ComposeMail } from './compose.js';

export function EmailInbox() {
  const [items, setItems] = useState<Email[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setItems(await createEmailClient().list());
  }, []);

  useEffect(() => {
    reload().catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load mail'));
  }, [reload]);

  async function onAdd(input: AddEmailInput) {
    await createEmailClient().add(input);
    await reload();
  }

  return (
    <Column title="Mail" icon={Mail}>
      <ComposeMail onAdd={onAdd} />
      {!items ? (
        <p className="p-4 text-sm text-muted-foreground">{error ?? 'Loading…'}</p>
      ) : items.length === 0 ? (
        <EmptyState icon={InboxIcon} title="No mail yet" description="Store a message in the SQL database." />
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="px-4 py-3">
              <p className="truncate text-sm font-medium">{item.subject || '(no subject)'}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.fromAddr} → {item.toAddr}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Column>
  );
}
