import { useState, type FormEvent } from 'react';
import { Button, Input } from '@buildautomaton/ui-runtime';
import type { AddEmailInput } from '../../types/email.js';

export function ComposeMail({ onAdd }: { onAdd: (input: AddEmailInput) => Promise<void> }) {
  const [fromAddr, setFrom] = useState('');
  const [toAddr, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!fromAddr.trim() || !toAddr.trim()) return;
    setBusy(true);
    try {
      await onAdd({ fromAddr, toAddr, subject });
      setFrom('');
      setTo('');
      setSubject('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-2 border-b border-border p-4">
      <Input value={fromAddr} onChange={(e) => setFrom(e.target.value)} placeholder="From" required />
      <Input value={toAddr} onChange={(e) => setTo(e.target.value)} placeholder="To" required />
      <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
      <Button type="submit" size="sm" disabled={busy}>
        Store message
      </Button>
    </form>
  );
}
