import { useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import { PromptField } from '@buildautomaton/ui-runtime';
import { PromptActions } from './prompt-actions.js';

export function PromptGate({
  onSubmit,
  lockedValue,
}: {
  onSubmit?: (prompt: string) => Promise<void>;
  lockedValue?: string;
}) {
  const id = useId();
  const locked = lockedValue !== undefined;
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const shown = locked ? lockedValue : value;
  const empty = !shown.trim();

  async function submit() {
    const next = shown.trim();
    if (!next || busy || locked || !onSubmit) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start the app');
      setBusy(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  }

  function onFormSubmit(event: FormEvent) {
    event.preventDefault();
    void submit();
  }

  return (
    <main className="flex h-full min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <form className="w-full max-w-2xl" onSubmit={onFormSubmit}>
        <label htmlFor={id} className="sr-only">
          What do you want to build?
        </label>
        <div className="relative rounded-2xl border border-border bg-card shadow-md">
          <PromptField
            id={id}
            value={shown}
            readOnly={locked}
            disabled={busy || locked}
            rows={6}
            placeholder="What do you want to build?"
            className="min-h-48 rounded-2xl border-0 bg-transparent px-4 pb-16 pt-4 text-base"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
          />
          {locked ? null : (
            <PromptActions typing={shown.length > 0} disabled={busy || empty} onSubmit={() => void submit()} />
          )}
        </div>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </form>
    </main>
  );
}
