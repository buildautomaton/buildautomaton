import { useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import { PromptField, PromptToolbar } from '@buildautomaton/ui-runtime';

export function PromptGate({ onSubmit }: { onSubmit: (prompt: string) => Promise<void> }) {
  const id = useId();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const empty = !value.trim();

  async function submit() {
    const next = value.trim();
    if (!next || busy) return;
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
    <main className="flex h-full items-center justify-center bg-background px-6 text-foreground">
      <form className="w-full max-w-xl" onSubmit={onFormSubmit}>
        <label htmlFor={id} className="text-2xl font-medium tracking-tight">
          What should this become?
        </label>
        <PromptField
          id={id}
          value={value}
          disabled={busy}
          rows={5}
          placeholder="Describe the app…"
          className="mt-6 min-h-32 rounded-lg border border-border bg-card px-3"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="mt-2">
          <PromptToolbar disabled={busy || empty} onSubmit={() => void submit()} />
        </div>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </form>
    </main>
  );
}
