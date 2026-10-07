import { Mic } from 'lucide-react';
import { Button, PromptSendButton } from '@buildautomaton/ui-runtime';

export function PromptActions({
  typing,
  disabled,
  onSubmit,
}: {
  typing: boolean;
  disabled: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-1">
      {typing ? <VoiceButton bare /> : null}
      {typing ? <PromptSendButton disabled={disabled} onClick={onSubmit} /> : <VoiceButton />}
    </div>
  );
}

function VoiceButton({ bare = false }: { bare?: boolean }) {
  return (
    <Button
      type="button"
      size="icon"
      variant={bare ? 'ghost' : 'default'}
      title="Voice input"
      aria-label="Voice input"
      className={
        bare
          ? 'h-9 w-9 rounded-full bg-transparent text-foreground shadow-none hover:bg-transparent'
          : 'h-9 w-9 rounded-full'
      }
    >
      <Mic className="h-4 w-4" />
    </Button>
  );
}
