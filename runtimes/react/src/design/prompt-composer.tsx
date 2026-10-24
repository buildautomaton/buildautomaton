import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { PromptField } from './prompt-field.js';
import { PromptToolbar } from './prompt-toolbar.js';

export function PromptComposer({
  placeholder = 'Add a draft…',
  disabled,
  onSubmit,
  leading,
  placement = 'top',
}: {
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (value: string) => Promise<void> | void;
  leading?: ReactNode;
  placement?: 'top' | 'bottom';
}) {
  const id = useId();
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const blocked = disabled || busy;
  const empty = !value.trim();

  async function submit() {
    const next = value.trim();
    if (!next || blocked) return;
    setBusy(true);
    try {
      await onSubmit(next);
      setValue('');
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  }

  const frame = placement === 'bottom' ? 'shrink-0 border-t border-border px-4 pb-2 pt-3' : 'border-b border-border px-4 pt-3';
  return (
    <div className={frame}>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <PromptField
        id={id}
        value={value}
        disabled={blocked}
        rows={3}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
      />
      <PromptToolbar leading={leading} disabled={blocked || empty} onSubmit={() => void submit()} />
    </div>
  );
}
