import type { ReactNode } from 'react';
import { PromptSendButton } from './prompt-send.js';

export function PromptToolbar({
  disabled,
  onSubmit,
  leading,
}: {
  disabled?: boolean;
  onSubmit: () => void;
  leading?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border/40 px-1 pb-1 pt-0.5">
      <div className="flex min-w-0 items-center gap-1">{leading}</div>
      <PromptSendButton disabled={disabled} onClick={onSubmit} />
    </div>
  );
}
